// Spoonacular API Configuration
const API_BASE_URL = 'https://api.spoonacular.com';

interface SpoonacularConfig {
  baseURL: string;
  apiKey: string;
}

export const spoonacularConfig: SpoonacularConfig = {
  baseURL: API_BASE_URL,
  apiKey: '',
};

// Recipe search parameters
export interface RecipeSearchParams {
  number?: number;
  diet?: string;
  intolerances?: string;
  excludeIngredients?: string;
  includeIngredients?: string;
  query?: string;
  maxReadyTime?: number;
  type?:
    | 'main course'
    | 'side dish'
    | 'dessert'
    | 'appetizer'
    | 'salad'
    | 'bread'
    | 'breakfast'
    | 'soup'
    | 'beverage'
    | 'sauce'
    | 'marinade'
    | 'fingerfood'
    | 'snack'
    | 'drink';
  cuisine?: string;
}

// Meal plan generation parameters
export interface MealPlanParams {
  timeFrame: 'day' | 'week';
  targetCalories?: number;
  diet?: string;
  exclude?: string;
}

// Recipe response types
export interface Recipe {
  id: number;
  title: string;
  image?: string;
  imageType?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  summary?: string;
  instructions?: string;
  extendedIngredients?: Ingredient[];
  nutrition?: NutritionInfo;
  healthScore?: number;
  diets?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
  image?: string;
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  fat: string;
  carbohydrates: string;
  nutrients?: {
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    [key: string]: number | undefined;
  };
}

// Meal plan response types
export interface MealPlan {
  meals: Meal[];
  nutrients: DayNutrients;
}

export interface WeeklyMealPlan {
  week: {
    [key: string]: MealPlan; // 'monday', 'tuesday', etc.
  };
}

export interface Meal {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image?: string;
}

export interface DayNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

// API Service Class
class SpoonacularAPI {
  private config: SpoonacularConfig;

  constructor(config: SpoonacularConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    const url = new URL(`${this.config.baseURL}${endpoint}`);

    // Add API key and other parameters
    url.searchParams.append('apiKey', this.config.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Spoonacular API Error:', error);
      throw error;
    }
  }

  // Search for recipes
  async searchRecipes(
    params: RecipeSearchParams,
  ): Promise<{ results: Recipe[] }> {
    return this.makeRequest<{ results: Recipe[] }>('/recipes/complexSearch', {
      ...params,
      addRecipeInformation: true,
      fillIngredients: true,
    });
  }

  // Get random recipes
  async getRandomRecipes(
    params: Partial<RecipeSearchParams> = {},
  ): Promise<{ recipes: Recipe[] }> {
    return this.makeRequest<{ recipes: Recipe[] }>('/recipes/random', {
      number: 1,
      ...params,
    });
  }

  // Generate meal plan for a day
  async generateDayMealPlan(params: MealPlanParams): Promise<MealPlan> {
    return this.makeRequest<MealPlan>('/mealplanner/generate', {
      ...params,
      timeFrame: 'day',
    });
  }

  // Generate meal plan for a week
  async generateWeekMealPlan(params: MealPlanParams): Promise<WeeklyMealPlan> {
    return this.makeRequest<WeeklyMealPlan>('/mealplanner/generate', {
      ...params,
      timeFrame: 'week',
    });
  }

  // Get recipe information by ID
  async getRecipeInformation(id: number): Promise<Recipe> {
    return this.makeRequest<Recipe>(`/recipes/${id}/information`, {
      includeNutrition: true,
    });
  }
}

// Export the API instance
export const spoonacularAPI = new SpoonacularAPI(spoonacularConfig);

// Helper functions to map app data to API parameters
export const mapDietaryPreferences = (
  culturalPreferences: string[],
): string => {
  const dietMap: Record<string, string> = {
    'Classic Low-Carb / Keto-style': 'ketogenic',
    'Italian / Mediterranean': 'mediterranean',
    'Asian / Stir Fry': '',
    'Indian / Curry': '',
    'Middle Eastern': '',
    'American comfort': '',
    'Tex-Mex / Southwest': '',
    'Southern / BBQ': '',
    'Open to anything': '',
  };

  for (const preference of culturalPreferences) {
    if (dietMap[preference]) {
      return dietMap[preference];
    }
  }
  return '';
};

export const mapAllergies = (allergies: string[]): string => {
  const allergyMap: Record<string, string> = {
    Dairy: 'dairy',
    Eggs: 'egg',
    Gluten: 'gluten',
    Soy: 'soy',
    Peanuts: 'peanut',
    'Tree Nuts': 'tree-nut',
    Fish: 'seafood',
    Shellfish: 'shellfish',
    Sesame: 'sesame',
    Corn: '',
    Nightshades: '',
    Chicken: 'chicken',
  };

  return allergies
    .map(allergy => allergyMap[allergy])
    .filter(mapped => mapped)
    .join(',');
};

export const mapCookingTime = (cookingTime: string): number => {
  const timeMap: Record<string, number> = {
    '15-30 min': 30,
    '30-45 min': 45,
    '45-60 min': 60,
    '60+ min': 120,
  };

  return timeMap[cookingTime] || 60;
};
