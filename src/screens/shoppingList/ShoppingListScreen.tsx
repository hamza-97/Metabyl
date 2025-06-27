import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useShoppingListStore, ShoppingItem } from '../../store/shoppingListStore';

type GroupedItems = {
  [recipeName: string]: ShoppingItem[];
};

const ShoppingListScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  
  // Get shopping list items from store
  const { items, toggleItem, removeItem, clearItems, clearCheckedItems } = useShoppingListStore();
  
  // State for showing/hiding recipe groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  
  // Toggle a recipe group's collapsed state
  const toggleGroup = (recipeName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [recipeName]: !prev[recipeName]
    }));
  };
  
  // Group items by recipe
  const groupedItems: GroupedItems = items.reduce((groups, item) => {
    const recipeName = item.recipeName || 'Other Items';
    if (!groups[recipeName]) {
      groups[recipeName] = [];
    }
    groups[recipeName].push(item);
    return groups;
  }, {} as GroupedItems);
  
  // Handle clear all confirmation
  const handleClearAll = () => {
    Alert.alert(
      'Clear Shopping List',
      'Are you sure you want to clear your entire shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => clearItems() }
      ]
    );
  };
  
  // Handle clear checked items
  const handleClearChecked = () => {
    Alert.alert(
      'Clear Checked Items',
      'Remove all checked items from your shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove Checked', onPress: () => clearCheckedItems() }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>Shopping List</Text>
        <View style={styles.headerButtons}>
          {items.length > 0 && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleClearChecked}
            >
              <Icon name="checkbox-marked-outline" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Recipes' as never)}
          >
            <Icon name="plus" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
          {items.length > 0 && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleClearAll}
            >
              <Icon name="delete-outline" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={[styles.emptyState, isDarkMode && styles.emptyStateDark]}>
            <Icon name="cart-outline" size={50} color="#CCCCCC" />
            <Text style={[styles.emptyStateText, isDarkMode && styles.textLightSecondary]}>
              Your shopping list is empty
            </Text>
            <Text style={[styles.emptyStateSubtext, isDarkMode && styles.textLightSecondary]}>
              Items from your meal plan will appear here
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('Recipes' as never)}
            >
              <Text style={styles.createButtonText}>Browse Recipes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {Object.entries(groupedItems).map(([recipeName, recipeItems]) => (
              <View key={recipeName} style={[styles.recipeGroup, isDarkMode && styles.recipeGroupDark]}>
                <TouchableOpacity 
                  style={styles.recipeHeader}
                  onPress={() => toggleGroup(recipeName)}
                >
                  <View style={styles.recipeHeaderLeft}>
                    <Icon 
                      name={collapsedGroups[recipeName] ? 'chevron-right' : 'chevron-down'} 
                      size={20} 
                      color={isDarkMode ? '#FFFFFF' : '#333333'} 
                    />
                    <Text style={[styles.recipeTitle, isDarkMode && styles.textLight]}>
                      {recipeName} ({recipeItems.length})
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {!collapsedGroups[recipeName] && (
                  <View style={styles.itemsList}>
                    {recipeItems.map((item) => (
                      <View key={item.id} style={styles.shoppingItem}>
                        <TouchableOpacity 
                          style={[
                            styles.checkbox, 
                            item.checked && styles.checkboxChecked
                          ]}
                          onPress={() => toggleItem(item.id)}
                        >
                          {item.checked && (
                            <Icon name="check" size={16} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>
                        <Text 
                          style={[
                            styles.itemText, 
                            isDarkMode && styles.textLight,
                            item.checked && styles.itemTextChecked
                          ]}
                        >
                          {item.original || `${item.amount || ''} ${item.unit || ''} ${item.name}`.trim()}
                        </Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => removeItem(item.id)}
                        >
                          <Icon name="close" size={18} color={isDarkMode ? '#AAAAAA' : '#999999'} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
            
            <View style={styles.bottomSpace} />
          </>
        )}

        <View style={[styles.tipContainer, isDarkMode && styles.tipContainerDark]}>
          <View style={styles.tipIconContainer}>
            <Icon name="lightbulb-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.tipTextContainer}>
            <Text style={[styles.tipTitle, isDarkMode && styles.textLight]}>Pro Tip</Text>
            <Text style={[styles.tipText, isDarkMode && styles.textLightSecondary]}>
              You can check off items as you shop and they'll be saved for your next trip.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 5,
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  emptyStateDark: {
    backgroundColor: '#2A2A2A',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#5DB075',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recipeGroup: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  recipeGroupDark: {
    backgroundColor: '#2A2A2A',
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  recipeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  itemsList: {
    padding: 10,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#5DB075',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#5DB075',
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteButton: {
    padding: 5,
  },
  bottomSpace: {
    height: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F7F3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  tipContainerDark: {
    backgroundColor: '#2A2A2A',
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default ShoppingListScreen; 
