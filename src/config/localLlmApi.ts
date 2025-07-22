// Local LLM API Configuration
const LOCAL_LLM_BASE_URL = 'http://localhost:9002'; // Change to your computer's IP for physical devices

interface LocalLlmConfig {
  baseURL: string;
}

export const localLlmConfig: LocalLlmConfig = {
  baseURL: LOCAL_LLM_BASE_URL,
};

// Input/Output types matching the studio LLM schemas
export interface GenerateMealPlanInput {
  dietaryRequirements: string;
  availableIngredients: string;
  cuisinePreferences: string;
  familyPreferences: string;
}

export interface ShoppingListItem {
  name: string;
  quantity: string;
}

export interface PerMealNutritionalInfo {
  calories: number;
  protein: string;
  carbohydrates: string;
  fat: string;
}

export interface LlmMeal {
  name: string;
  description: string;
  ingredients: ShoppingListItem[];
  nutritionalInfo: PerMealNutritionalInfo;
  imageUrl?: string;
}

export interface DailyPlan {
  day: string;
  breakfast: LlmMeal;
  lunch: LlmMeal;
  dinner: LlmMeal;
}

export interface NutritionalBreakdown {
  summary: string;
  calories: number;
  macros: {
    protein: string;
    carbohydrates: string;
    fat: string;
  };
}

export interface ShoppingListCategory {
  category: string;
  items: ShoppingListItem[];
}

export interface GenerateMealPlanOutput {
  mealPlan: DailyPlan[];
  nutritionalBreakdown: NutritionalBreakdown;
  shoppingList: ShoppingListCategory[];
}

// Adapted Recipe interface for LLM responses
export interface LlmRecipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  ingredients: ShoppingListItem[];
  nutritionalInfo: PerMealNutritionalInfo;
  instructions?: string;
  summary?: string;
}

// API Service Class
class LocalLlmAPI {
  private config: LocalLlmConfig;

  constructor(config: LocalLlmConfig) {
    this.config = config;
  }

  private async makeRequest<T>(endpoint: string, body: any): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `LLM API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Local LLM API Error:', error);
      throw error;
    }
  }

  // Generate meal plan using LLM
  async generateMealPlan(
    input: GenerateMealPlanInput,
  ): Promise<GenerateMealPlanOutput> {
    return this.makeRequest<GenerateMealPlanOutput>(
      '/api/genkit/generate-meal-plan',
      input,
    );
  }

  // Convert LLM meal to app's recipe format
  convertMealToRecipe(meal: LlmMeal, id: string): LlmRecipe {
    return {
      id,
      title: meal.name,
      description: meal.description,
      image: meal.imageUrl,
      readyInMinutes: 30, // Default since LLM doesn't provide this
      servings: 2, // Default
      ingredients: meal.ingredients,
      nutritionalInfo: meal.nutritionalInfo,
      summary: meal.description,
    };
  }

  // Helper method to create input from app data
  createMealPlanInput(
    dietaryPreferences: string[],
    allergies: string[],
    unwantedFoods: string[],
    availableIngredients: string = '',
    cuisinePreferences: string = '',
    isWeekly: boolean = false,
    peopleCount: number = 2,
    cookingTime?: string,
  ): GenerateMealPlanInput {
    // Build dietary requirements string
    let dietaryRequirements = '';

    if (isWeekly) {
      dietaryRequirements += 'weekly meal plan, ';
    } else {
      dietaryRequirements += 'daily meal plan, ';
    }

    dietaryRequirements += `${peopleCount} servings, `;

    if (dietaryPreferences.length > 0) {
      dietaryRequirements += `dietary preferences: ${dietaryPreferences.join(
        ', ',
      )}, `;
    }

    if (allergies.length > 0) {
      dietaryRequirements += `allergies to avoid: ${allergies.join(', ')}, `;
    }

    if (unwantedFoods.length > 0) {
      dietaryRequirements += `foods to avoid: ${unwantedFoods.join(', ')}, `;
    }

    if (cookingTime) {
      dietaryRequirements += `cooking time preference: ${cookingTime}, `;
    }

    // Remove trailing comma and space
    dietaryRequirements = dietaryRequirements.replace(/, $/, '');

    return {
      dietaryRequirements,
      availableIngredients: availableIngredients || 'common pantry staples',
      cuisinePreferences: cuisinePreferences || 'varied international cuisine',
      familyPreferences: `family-friendly meals for ${peopleCount} people`,
    };
  }
}

// Export the API instance
export const localLlmAPI = new LocalLlmAPI(localLlmConfig);
