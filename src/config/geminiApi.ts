import { GoogleGenerativeAI } from '@google/generative-ai';
import ImageGenerationService from './imageGenerationApi';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY || '');

export interface MealPlanInput {
  dietaryRequirements: string;
  availableIngredients?: string;
  cuisinePreferences?: string;
  familyPreferences?: string;
}

export interface Meal {
  name: string;
  description: string;
  ingredients: Array<{ name: string; quantity: string }>;
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbohydrates: string;
    fat: string;
  };
  imageUrl?: string;
}

export interface DailyPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface MealPlanOutput {
  mealPlan: DailyPlan[];
  nutritionalBreakdown: {
    summary: string;
    calories: number;
    macros: {
      protein: string;
      carbohydrates: string;
      fat: string;
    };
  };
  shoppingList: Array<{ name: string; quantity: string; category: string }>;
}

export interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbohydrates: string;
    fat: string;
  };
  instructions: string;
  summary: string;
  diets?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  healthScore?: number;
  sourceUrl?: string;
}

export class GeminiService {
  private static instance: GeminiService;
  private model: any;

  private constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateMealPlan(input: MealPlanInput): Promise<MealPlanOutput> {
    try {
      const prompt = this.buildMealPlanPrompt(input);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      console.log('response of api is ', response);
      const text = response.text();

      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      // Parse the JSON response
      const parsed = JSON.parse(jsonMatch[0]);

      // Generate images for all meals in parallel
      const allMeals: Meal[] = [];
      parsed.mealPlan.forEach((dailyPlan: DailyPlan) => {
        allMeals.push(dailyPlan.breakfast, dailyPlan.lunch, dailyPlan.dinner);
      });

      try {
        console.log('Generating images for', allMeals.length, 'meals...');
        const imageUrls =
          await ImageGenerationService.generateImagesForMealPlan(allMeals);

        // Assign images to meals
        parsed.mealPlan.forEach((dailyPlan: DailyPlan) => {
          dailyPlan.breakfast.imageUrl =
            imageUrls.get(dailyPlan.breakfast.name) || '';
          dailyPlan.lunch.imageUrl = imageUrls.get(dailyPlan.lunch.name) || '';
          dailyPlan.dinner.imageUrl =
            imageUrls.get(dailyPlan.dinner.name) || '';
        });

        console.log('Successfully generated', imageUrls.size, 'images');
      } catch (imageError) {
        console.warn(
          'Image generation failed, continuing without images:',
          imageError,
        );
        // Continue without images if generation fails
      }

      return parsed;
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
      throw error;
    }
  }

  async generateRecipeDetail(
    recipeId: number,
    recipeTitle: string,
  ): Promise<RecipeDetail> {
    try {
      const prompt = this.buildRecipeDetailPrompt(recipeTitle);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      // Parse the JSON response
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        id: recipeId,
        ...parsed,
      };
    } catch (error) {
      console.error('Failed to generate recipe detail:', error);
      throw error;
    }
  }

  private buildMealPlanPrompt(input: MealPlanInput): string {
    return `You are a meal planning assistant. Generate a 7-day meal plan and return ONLY valid JSON without any additional text, markdown formatting, or explanations.

Return exactly this JSON structure:

{
  "mealPlan": [
    {
      "breakfast": {
        "name": "Meal Name",
        "description": "Short description",
        "ingredients": [{"name": "ingredient", "quantity": "amount"}],
        "nutritionalInfo": {
          "calories": 300,
          "protein": "15g",
          "carbohydrates": "45g",
          "fat": "8g"
        }
      },
      "lunch": {
        "name": "Meal Name",
        "description": "Short description",
        "ingredients": [{"name": "ingredient", "quantity": "amount"}],
        "nutritionalInfo": {
          "calories": 500,
          "protein": "25g",
          "carbohydrates": "60g",
          "fat": "20g"
        }
      },
      "dinner": {
        "name": "Meal Name",
        "description": "Short description",
        "ingredients": [{"name": "ingredient", "quantity": "amount"}],
        "nutritionalInfo": {
          "calories": 600,
          "protein": "30g",
          "carbohydrates": "70g",
          "fat": "25g"
        }
      }
    }
  ],
  "nutritionalBreakdown": {
    "summary": "Overall nutrition summary",
    "calories": 2000,
    "macros": {
      "protein": "80g",
      "carbohydrates": "250g",
      "fat": "65g"
    }
  },
  "shoppingList": [
    {"name": "item", "quantity": "amount", "category": "category"}
  ]
}

User Preferences:
- Dietary Requirements: ${input.dietaryRequirements}
- Available Ingredients: ${input.availableIngredients || 'Any'}
- Cuisine Preferences: ${input.cuisinePreferences || 'Any'}
- Family Preferences: ${input.familyPreferences || 'None'}

Generate a complete 7-day meal plan with varied, healthy meals. Ensure all nutritional information is realistic and the shopping list includes all necessary ingredients. Return ONLY the JSON object, no other text.`;
  }

  private buildRecipeDetailPrompt(recipeTitle: string): string {
    return `You are a recipe assistant. Generate a detailed recipe for "${recipeTitle}" and return ONLY valid JSON without any additional text, markdown formatting, or explanations.

Return exactly this JSON structure:

{
  "title": "${recipeTitle}",
  "description": "Brief description of the dish",
  "image": "https://via.placeholder.com/400x300",
  "readyInMinutes": 30,
  "servings": 4,
  "ingredients": [
    {
      "name": "ingredient name",
      "quantity": "2 cups",
      "amount": 2,
      "unit": "cups",
      "original": "2 cups ingredient name"
    }
  ],
  "nutritionalInfo": {
    "calories": 350,
    "protein": "25g",
    "carbohydrates": "45g",
    "fat": "12g"
  },
  "instructions": "Step 1. First instruction. Step 2. Second instruction. Step 3. Third instruction.",
  "summary": "A delicious and healthy recipe that's easy to make.",
  "diets": ["vegetarian", "gluten-free"],
  "vegetarian": true,
  "vegan": false,
  "glutenFree": true,
  "dairyFree": false,
  "healthScore": 85
}

Generate a realistic, detailed recipe with:
- Accurate ingredient measurements
- Step-by-step cooking instructions
- Realistic nutritional information
- Appropriate cooking time and servings
- Dietary tags based on the recipe
- A health score (0-100)

Make sure the recipe is practical and can actually be cooked at home. Return ONLY the JSON object, no other text.`;
  }
}

export default GeminiService.getInstance();
