import { create } from 'zustand';
import { QuestionnaireResponse } from '../types/questionnaire';

interface QuestionnaireStore {
  responses: QuestionnaireResponse;
  setResponses: (responses: QuestionnaireResponse) => void;
  clearResponses: () => void;
}

export const initialState: QuestionnaireResponse = {
  peopleCount: 1,
  hasChildren: false,
  childrenCount: 0,
  foodAllergies: [],
  unwantedFoods: [],
  cookingSkill: 'Beginner',
  weekdayCookingTime: '15-30 min',
  wantsBatchCooking: false,
  groceryStores: [],
  wantsAutomaticMenus: true,
  wantsWeeklyPlan: true,
  cookingEquipment: ['Standard oven & stovetop'],
  includeGrillingSmoking: false,
  grillingDays: [],
  wantsBatchProtein: false,
  mealRepeatFrequency: 'once_per_week',
  extraPortions: 'none',
  includeSnacks: false,
  culturalPreferences: ['Open to anything'],
  includeEmergencyMeals: true,
  storageCapacity: 'limited',
};

export const useQuestionnaireStore = create<QuestionnaireStore>()(set => ({
  responses: initialState,
  setResponses: (responses: QuestionnaireResponse) => set({ responses }),
  clearResponses: () => set({ responses: initialState }),
}));
