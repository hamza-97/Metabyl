export type CookingSkillLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Confident'
  | 'Chef Mode';
export type CookingTime =
  | '15 min or less'
  | '15-30 min'
  | '30-45 min'
  | '45+ min';
export type WeeklyPrepTime = '30 min' | '1 hr' | '2+ hrs';
export type GroceryStore =
  | 'Albertsons'
  | 'Aldi'
  | "Costco/Sam's"
  | 'Fresh Market / Whole Foods'
  | "Farmer's Market / CSA"
  | 'Food Lion'
  | 'H-E-B'
  | 'Kroger'
  | 'Meier'
  | 'Publix'
  | 'Target'
  | 'Walmart'
  | 'Online delivery';

export type CookingEquipment =
  | 'Standard oven & stovetop'
  | 'Instant Pot / Pressure Cooker'
  | 'Slow Cooker / Crockpot'
  | 'Air Fryer'
  | 'Outdoor Grill'
  | 'Pellet Smoker'
  | 'Kamado / Ceramic Smoker'
  | 'No specialized equipment';

export type FoodAllergy =
  | 'Dairy'
  | 'Eggs'
  | 'Gluten'
  | 'Soy'
  | 'Peanuts'
  | 'Tree Nuts'
  | 'Fish'
  | 'Shellfish'
  | 'Sesame'
  | 'Corn'
  | 'Nightshades'
  | 'Chicken';

export type CulturalStyle =
  | 'American comfort'
  | 'Tex-Mex / Southwest'
  | 'Asian / Stir Fry'
  | 'Italian / Mediterranean'
  | 'Middle Eastern'
  | 'Indian / Curry'
  | 'Southern / BBQ'
  | 'Classic Low-Carb / Keto-style'
  | 'Open to anything';

export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface QuestionnaireResponse {
  // Section 1: Basic Household Setup
  peopleCount: number;
  hasChildren: boolean;

  // Section 2: Food Preferences & Dietary Needs
  foodAllergies: FoodAllergy[];
  unwantedFoods: string[];

  // Section 3: Cooking Skill & Prep Preferences
  cookingSkill: CookingSkillLevel;
  weekdayCookingTime: CookingTime;
  wantsBatchCooking: boolean;
  weeklyPrepTime?: WeeklyPrepTime;

  // Section 4: Shopping
  groceryStores: GroceryStore[];

  // Section 5: Final Personalization
  wantsAutomaticMenus: boolean;
  wantsWeeklyPlan: boolean;
  cookingEquipment: CookingEquipment[];
  includeGrillingSmoking: boolean;
  grillingDays: WeekDay[];

  // Batch Cooking
  wantsBatchProtein: boolean;

  // Meal Repetition
  mealRepeatFrequency: 'no_repeats' | 'once_per_week' | 'multiple_times';

  // Portions and Leftovers
  extraPortions: 'none' | 'one_per_person' | 'two_per_person';

  // Snacks
  includeSnacks: boolean;

  // Cultural Preferences
  culturalPreferences: CulturalStyle[];

  // Emergency Meals
  includeEmergencyMeals: boolean;

  // Storage
  storageCapacity: 'full' | 'limited' | 'none';
}
