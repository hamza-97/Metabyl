import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.textLight]}>Metabyl</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="account-circle" size={30} color={isDarkMode ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, isDarkMode && styles.textLight]}>
            Welcome to Metabyl
          </Text>
          <Text style={[styles.welcomeSubtitle, isDarkMode && styles.textLightSecondary]}>
            Your AI-powered meal planning assistant
          </Text>
        </View>

        <TouchableOpacity style={styles.createPlanButton}>
          <Icon name="plus-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.createPlanButtonText}>Create Meal Plan</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
            This Week's Plan
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.emptyState, isDarkMode && styles.emptyStateDark]}>
          <Icon name="food-variant" size={50} color="#CCCCCC" />
          <Text style={[styles.emptyStateText, isDarkMode && styles.textLightSecondary]}>
            No meal plans yet
          </Text>
          <Text style={[styles.emptyStateSubtext, isDarkMode && styles.textLightSecondary]}>
            Create your first meal plan to get started
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>
            Recommended Recipes
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.emptyState, isDarkMode && styles.emptyStateDark]}>
          <Icon name="chef-hat" size={50} color="#CCCCCC" />
          <Text style={[styles.emptyStateText, isDarkMode && styles.textLightSecondary]}>
            Recipes coming soon
          </Text>
          <Text style={[styles.emptyStateSubtext, isDarkMode && styles.textLightSecondary]}>
            We're preparing some delicious recipes for you
          </Text>
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
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  createPlanButton: {
    backgroundColor: '#5DB075',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonIcon: {
    marginRight: 10,
  },
  createPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    color: '#5DB075',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
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
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default HomeScreen; 
