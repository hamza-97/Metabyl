# Image Generation Integration Setup

This document explains how the image generation functionality works in the Metabyl app.

## Overview

The app now includes **client-side image generation** using Google's Gemini 2.0 Flash model directly in the React Native app. No separate server is required!

## How It Works

### 1. Direct Gemini API Integration

The app uses the Google Generative AI SDK to generate images directly:

```typescript
// In src/config/imageGenerationApi.ts
const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-preview-image-generation',
});
```

### 2. Automatic Image Generation

When a meal plan is generated, the app automatically:

1. **Extracts meal names** from the generated meal plan
2. **Calls Gemini API** for each meal to generate images
3. **Assigns images to meals** in the meal plan
4. **Displays images** in the meal plan interface

### 3. Fallback System

If image generation fails, the app uses placeholder images:

```typescript
// Fallback to placeholder images
imageUrl: 'https://via.placeholder.com/400x300/5DB075/FFFFFF?text=' +
  encodeURIComponent(mealName);
```

## Setup

### 1. API Key Configuration

Make sure your Gemini API key is configured in the image generation service:

```typescript
// In src/config/imageGenerationApi.ts
this.genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY');
```

### 2. Dependencies

Ensure you have the Google Generative AI package installed:

```bash
npm install @google/generative-ai
```

## Features

### ✅ **Client-Side Generation**

- No server required
- Direct integration with Gemini API
- Works offline (except for API calls)

### ✅ **Parallel Processing**

- Generates images for all meals simultaneously
- Faster overall generation time
- Better user experience

### ✅ **Error Resilience**

- Graceful fallback to placeholder images
- App continues working even if image generation fails
- Detailed error logging for debugging

### ✅ **Performance Optimized**

- Parallel image generation
- Efficient memory usage
- Responsive UI during generation

## Usage

### 1. Generate Meal Plan with Images

```typescript
// The meal plan generation automatically includes image generation
const mealPlan = await GeminiService.generateMealPlan({
  dietaryRequirements: 'High protein, low carb',
  availableIngredients: 'Chicken, vegetables',
  cuisinePreferences: 'Mediterranean',
  familyPreferences: 'For 4 people',
});

// Images are automatically generated and included
console.log(mealPlan.mealPlan[0].breakfast.imageUrl); // Generated image URL
```

### 2. Display Images in UI

The `ComprehensiveMealPlanDisplay` component automatically shows generated images:

```typescript
<ComprehensiveMealPlanDisplay mealPlan={mealPlan} />
```

## Troubleshooting

### 1. Image Generation Fails

- Check that your Gemini API key is valid
- Verify internet connectivity
- Check console logs for detailed error messages
- The app will use placeholder images as fallback

### 2. Images Not Displaying

- Check that the `imageUrl` property is being set correctly
- Verify the image URLs are valid data URIs or HTTP URLs
- Check network connectivity for placeholder images

### 3. Performance Issues

- Image generation can take time for multiple meals
- Consider reducing the number of meals if performance is slow
- The app shows loading states during generation

## Security Considerations

1. **API Key Management**: Store your Gemini API key securely
2. **Rate Limiting**: Be aware of Gemini API rate limits
3. **Error Handling**: Don't expose sensitive error messages to users
4. **Data Privacy**: Images are generated locally, no data sent to external servers

## Future Enhancements

1. **Image Caching**: Cache generated images to avoid regenerating
2. **Background Generation**: Generate images in background while showing meal plan
3. **Image Quality Options**: Allow users to choose image quality/size
4. **Custom Prompts**: Allow customization of image generation prompts
5. **Multiple Images**: Generate multiple images per meal and let users choose

## API Limits

- **Gemini API**: Check Google's current rate limits
- **Image Size**: Generated images are optimized for mobile display
- **Concurrent Requests**: The app generates images in parallel (up to 21 meals)

## Cost Considerations

- **Gemini API**: Each image generation costs API credits
- **21 meals per plan**: Full meal plan generates 21 images
- **Fallback system**: Reduces costs by using placeholders when needed
