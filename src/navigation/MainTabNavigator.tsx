import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens (to be created)
import HomeScreen from '../screens/home/HomeScreen';
import RecipesScreen from '../screens/recipes/RecipesScreen';
import ShoppingListScreen from '../screens/shoppingList/ShoppingListScreen';

export type MainTabParamList = {
  Home: undefined;
  Recipes: undefined;
  ShoppingList: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recipes') {
            iconName = focused ? 'food' : 'food-outline';
          } else if (route.name === 'ShoppingList') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5DB075',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="ShoppingList" component={ShoppingListScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 
