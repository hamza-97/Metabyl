import { Meal } from '../types/mealPlan';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GenerateMealImageInput {
  mealName: string;
}

export interface GenerateMealImageOutput {
  imageUrl: string;
}

export class ImageGenerationService {
  private static instance: ImageGenerationService;
  private genAI: GoogleGenerativeAI;
  private model: any;

  private constructor() {
    this.genAI = new GoogleGenerativeAI(
      'AIzaSyASE0zWlyuFgWO7w47T-lTB78pihnpnYZA',
    );
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-preview-image-generation',
    });
  }

  static getInstance(): ImageGenerationService {
    if (!ImageGenerationService.instance) {
      ImageGenerationService.instance = new ImageGenerationService();
    }
    return ImageGenerationService.instance;
  }

  async generateMealImage(
    input: GenerateMealImageInput,
  ): Promise<GenerateMealImageOutput> {
    try {
      const prompt = `A beautiful, 4k, real, high-quality photograph of the following dish: ${input.mealName}`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const response = await result.response;

      // Check if the response contains image data
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((part: any) =>
        part.inlineData?.mimeType?.startsWith('image/'),
      );

      if (!imagePart?.inlineData?.data) {
        // Fallback to a placeholder image
        console.warn(
          `No image generated for ${input.mealName}, using placeholder`,
        );
        return {
          imageUrl:
            'https://via.placeholder.com/400x300/5DB075/FFFFFF?text=' +
            encodeURIComponent(input.mealName),
        };
      }

      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      return { imageUrl };
    } catch (error) {
      console.error('Failed to generate meal image:', error);
      // Return a placeholder image instead of throwing
      return {
        imageUrl:
          'https://via.placeholder.com/400x300/5DB075/FFFFFF?text=' +
          encodeURIComponent(input.mealName),
      };
    }
  }

  async generateImagesForMealPlan(meals: Meal[]): Promise<Map<string, string>> {
    const imageUrls = new Map<string, string>();

    // Generate images in parallel for better performance
    const imagePromises = meals.map(async meal => {
      try {
        console.log(`Generating image for: ${meal.name}`);
        const result = await this.generateMealImage({ mealName: meal.name });
        console.log(`Successfully generated image for: ${meal.name}`);
        return { mealName: meal.name, imageUrl: result.imageUrl };
      } catch (error) {
        console.error(`Failed to generate image for ${meal.name}:`, error);
        // Return placeholder image for failed generations
        return {
          mealName: meal.name,
          imageUrl:
            'https://via.placeholder.com/400x300/5DB075/FFFFFF?text=' +
            encodeURIComponent(meal.name),
        };
      }
    });

    const results = await Promise.all(imagePromises);

    results.forEach(({ mealName, imageUrl }) => {
      // Always set an image URL (either generated or placeholder)
      imageUrls.set(mealName, imageUrl);
    });

    return imageUrls;
  }
}

export default ImageGenerationService.getInstance();
