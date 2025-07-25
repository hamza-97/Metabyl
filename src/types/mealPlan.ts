export interface MealPlanOption {
  id: 'single' | 'weekly';
  title: string;
  subtitle: string;
  icon: string;
  isPremium?: boolean;
}

export interface SingleMealRequest {
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any';
}

// New API Response Types
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

// Legacy types for backward compatibility
export interface GeneratedMeal {
  id: number;
  title: string;
  image?: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl?: string;
  summary?: string;
  ingredients?: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[];
}

export interface WeeklyMealPlanData {
  [day: string]: {
    breakfast?: GeneratedMeal;
    lunch?: GeneratedMeal;
    dinner?: GeneratedMeal;
  };
}

export interface SingleMealPlan {
  type: 'single';
  meals: GeneratedMeal[];
  generatedAt: string;
  servings?: number;
}

export interface WeeklyMealPlan {
  type: 'weekly';
  meals: GeneratedMeal[];
  weeklyData: WeeklyMealPlanData;
  generatedAt: string;
  servings?: number;
}

// New comprehensive meal plan type
export interface ComprehensiveMealPlan {
  type: 'comprehensive';
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
  generatedAt: string;
  userPreferences?: {
    dietaryRequirements: string;
    availableIngredients?: string;
    cuisinePreferences?: string;
    familyPreferences?: string;
  };
}

export type GeneratedMealPlan =
  | SingleMealPlan
  | WeeklyMealPlan
  | ComprehensiveMealPlan;

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'any';
