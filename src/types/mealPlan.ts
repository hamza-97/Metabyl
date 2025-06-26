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

export interface GeneratedMealPlan {
  type: 'single' | 'weekly';
  meals: GeneratedMeal[];
  generatedAt: string;
  servings?: number;
}

export interface WeeklyMealPlanData {
  [day: string]: {
    breakfast?: GeneratedMeal;
    lunch?: GeneratedMeal;
    dinner?: GeneratedMeal;
  };
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'any';
