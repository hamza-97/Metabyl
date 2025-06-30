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

export type GeneratedMealPlan = SingleMealPlan | WeeklyMealPlan;

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'any';
