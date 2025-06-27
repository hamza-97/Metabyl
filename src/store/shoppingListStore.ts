import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ShoppingItem {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  recipeId?: number;
  recipeName?: string;
  checked: boolean;
  original?: string;
}

interface ShoppingListState {
  items: ShoppingItem[];
  addItem: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  addItems: (items: Omit<ShoppingItem, 'id' | 'checked'>[]) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearItems: () => void;
  clearCheckedItems: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    set => ({
      items: [],

      addItem: item =>
        set(state => {
          // Check if item already exists (by name and unit)
          const existingItem = state.items.find(
            i =>
              i.name.toLowerCase() === item.name.toLowerCase() &&
              i.unit === item.unit,
          );

          if (existingItem) {
            // Update existing item with new amount
            return {
              items: state.items.map(i =>
                i.id === existingItem.id
                  ? {
                      ...i,
                      amount: (i.amount || 0) + (item.amount || 0),
                      recipeId: item.recipeId || i.recipeId,
                      recipeName: item.recipeName || i.recipeName,
                      original: item.original || i.original,
                    }
                  : i,
              ),
            };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                ...item,
                id: Date.now().toString(),
                checked: false,
              },
            ],
          };
        }),

      addItems: newItems =>
        set(state => {
          let updatedItems = [...state.items];

          newItems.forEach(item => {
            // Check if item already exists
            const existingItemIndex = updatedItems.findIndex(
              i =>
                i.name.toLowerCase() === item.name.toLowerCase() &&
                i.unit === item.unit,
            );

            if (existingItemIndex >= 0) {
              // Update existing item
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                amount:
                  (updatedItems[existingItemIndex].amount || 0) +
                  (item.amount || 0),
                recipeId:
                  item.recipeId || updatedItems[existingItemIndex].recipeId,
                recipeName:
                  item.recipeName || updatedItems[existingItemIndex].recipeName,
                original:
                  item.original || updatedItems[existingItemIndex].original,
              };
            } else {
              // Add new item
              updatedItems.push({
                ...item,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                checked: false,
              });
            }
          });

          return { items: updatedItems };
        }),

      removeItem: id =>
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        })),

      toggleItem: id =>
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        })),

      clearItems: () => set({ items: [] }),

      clearCheckedItems: () =>
        set(state => ({
          items: state.items.filter(item => !item.checked),
        })),
    }),
    {
      name: 'metabyl-shopping-list',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
