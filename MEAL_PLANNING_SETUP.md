# 🍽️ Meal Planning Feature Setup Guide

## Overview

The meal planning feature uses the [Spoonacular Food API](https://spoonacular.com/food-api) to generate personalized meal plans based on user preferences collected in the questionnaire.

## Features

- **Single Meal Generation**: Create one meal with custom serving size
- **7-Day Weekly Plans**: Generate full weekly meal plans (21 meals)
- **Smart Filtering**: Uses user's dietary preferences, allergies, and cooking time
- **Recipe Integration**: Links to full recipes with ingredients

## Setup Instructions

### 1. Get Spoonacular API Key

1. Visit [Spoonacular API Console](https://spoonacular.com/food-api/console#Dashboard)
2. Create a free account
3. Get your API key from the dashboard

**Free Tier:** 150 requests/day
**Paid Plans:** Starting from $10/month for 5,000 requests

### 2. Configure API Key

Open `src/config/apiKeys.ts` and replace the placeholder:

```typescript
export const API_KEYS = {
  SPOONACULAR: 'YOUR_ACTUAL_API_KEY_HERE', // Replace this!
};
```

### 3. Test the Integration

1. Complete the user questionnaire to set preferences
2. Go to Home Screen
3. Tap "Create Meal Plan"
4. Try both single meal and weekly plan generation

## How It Works

### User Flow

```
User clicks "Create Meal Plan"
     ↓
Modal with two options:
├── 🍽️ Single Meal
│   ├── Ask for serving size
│   ├── Ask for meal type (breakfast/lunch/dinner/any)
│   └── Generate 1 personalized recipe
└── 📅 7-Day Plan
    └── Generate 21 meals (3 meals × 7 days)
```

### API Integration

The app maps user questionnaire data to Spoonacular API parameters:

- **Diet Type**: Cultural preferences → API diet parameter
- **Allergies**: Food allergies → intolerances parameter
- **Exclusions**: Unwanted foods → excludeIngredients parameter
- **Time Limits**: Cooking time → maxReadyTime parameter
- **Serving Size**: Household size or custom input

### Data Flow

1. **User Preferences** (from questionnaire store)
2. **API Request** (mapped parameters)
3. **Recipe Data** (from Spoonacular)
4. **Meal Plan** (structured for app display)
5. **UI Display** (cards with recipe details)

## Files Created/Modified

### New Files

- `src/config/spoonacularApi.ts` - API service & types
- `src/config/apiKeys.ts` - API key configuration
- `src/types/mealPlan.ts` - TypeScript types
- `src/components/common/MealPlanModal.tsx` - Main modal component
- `src/components/common/MealPlanDisplay.tsx` - Results display

### Modified Files

- `src/screens/home/HomeScreen.tsx` - Added meal planning integration

## API Endpoints Used

- `GET /recipes/random` - Single meal generation
- `GET /recipes/complexSearch` - Weekly plan meals
- `GET /recipes/{id}/information` - Detailed recipe info

## Error Handling

The app handles common scenarios:

- **No API Key**: Shows warning in development
- **No Internet**: Shows connection error
- **No Recipes Found**: Suggests adjusting preferences
- **API Limits**: Shows rate limit message

## Premium Features (Future)

Currently, weekly plans are free. Later implementation:

- Weekly plans behind premium paywall
- Advanced filtering options
- Shopping list integration
- Nutritional analysis

## Troubleshooting

**"No recipes found"**: User has too many dietary restrictions
**"API Error"**: Check internet connection and API key
**"Rate Limited"**: Free tier limit reached (150/day)

## Customization

You can modify the meal generation logic in:

- `MealPlanModal.tsx` - UI and user flow
- `spoonacularApi.ts` - API parameters and mapping
- `mealPlan.ts` - Data types and structures
