import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/userStore';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { name, email, dietaryPreference, allergies, isPremium } = useUserStore();
  const { responses } = useQuestionnaireStore();

  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      icon: 'cog',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      id: 'dietary',
      title: 'Dietary Preferences',
      icon: 'food-apple',
      subtitle: dietaryPreference || 'Not set',
    },
    {
      id: 'allergies',
      title: 'Allergies & Restrictions',
      icon: 'alert-circle',
      subtitle: allergies?.length > 0 ? `${allergies.length} items` : 'None',
    },
    {
      id: 'cooking',
      title: 'Cooking Preferences',
      icon: 'chef-hat',
      subtitle: responses.cookingSkill || 'Not set',
    },
    {
      id: 'household',
      title: 'Household Information',
      icon: 'home',
      subtitle: `${responses.peopleCount || 0} people`,
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: 'crown',
      subtitle: isPremium ? 'Premium' : 'Free',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information',
    },
    // {
    //   id: 'logout',
    //   title: 'Logout',
    //   icon: 'logout',
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Icon name="account" size={60} color="#fff" />
          </View>
          <Text style={styles.name}>{name || 'User'}</Text>
          <Text style={styles.email}>{email || 'No email set'}</Text>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Icon name="crown" size={14} color="#000" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Icon name={item.icon} size={24} color="#5DB075" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              <Icon name="chevron-right" size={24} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
  },
  premiumText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ProfileScreen; 
