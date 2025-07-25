import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedMealPlan } from '../types/mealPlan';

interface MealPlanState {
  mealPlans: GeneratedMealPlan[];
  addMealPlan: (mealPlan: GeneratedMealPlan) => void;
  removeMealPlan: (index: number) => void;
  clearMealPlans: () => void;
  getMealPlansByType: (
    type: 'single' | 'weekly' | 'comprehensive',
  ) => GeneratedMealPlan[];
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      mealPlans: [],

      addMealPlan: (mealPlan: GeneratedMealPlan) =>
        set(state => ({
          mealPlans: [mealPlan, ...state.mealPlans],
        })),

      removeMealPlan: (index: number) =>
        set(state => ({
          mealPlans: state.mealPlans.filter((_, i) => i !== index),
        })),

      clearMealPlans: () => set({ mealPlans: [] }),

      getMealPlansByType: (type: 'single' | 'weekly' | 'comprehensive') => {
        const { mealPlans } = get();
        return mealPlans.filter(plan => plan.type === type);
      },
    }),
    {
      name: 'metabyl-meal-plans',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
