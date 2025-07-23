import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/userStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { measurementUnit, setMeasurementUnit } = useUserStore();

  const units = [
    { id: 'metric', label: 'Metric (g, ml, °C)', icon: 'weight-kilogram' },
    { id: 'imperial', label: 'Imperial (oz, cups, °F)', icon: 'weight-pound' },
  ];

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'measurement_units',
          title: 'Measurement Units',
          subtitle: measurementUnit === 'metric' ? 'Metric (g, ml, °C)' : 'Imperial (oz, cups, °F)',
          icon: 'scale',
          type: 'option',
          options: units,
          value: measurementUnit,
          onSelect: (value: 'metric' | 'imperial') => setMeasurementUnit(value),
        },
        {
          id: 'conversion_tables',
          title: 'Measurement Conversion Tables',
          subtitle: 'View cooking measurement conversions',
          icon: 'table',
          type: 'navigation',
          onPress: () => navigation.navigate('ConversionTables' as never),
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage app notifications',
          icon: 'bell',
          type: 'navigation',
        },
        {
          id: 'appearance',
          title: 'Appearance',
          subtitle: 'Dark mode, text size',
          icon: 'palette',
          type: 'navigation',
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: 'translate',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: 'account-edit',
          type: 'navigation',
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Manage your subscription',
          icon: 'crown',
          type: 'navigation',
          onPress: () => navigation.navigate('Subscription' as never),
        },
        {
          id: 'privacy',
          title: 'Privacy & Data',
          subtitle: 'Manage your data and privacy settings',
          icon: 'shield-account',
          type: 'navigation',
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    if (item.type === 'option') {
      return (
        <View key={item.id} style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Icon name={item.icon} size={22} color="#5DB075" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingIconContainer}>
          <Icon name={item.icon} size={22} color="#5DB075" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={22} color="#CCCCCC" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Measurement Units Options */}
        {settingsSections[0].items[0].type === 'option' && (
          <View style={styles.optionsContainer}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.unitOption,
                  measurementUnit === unit.id && styles.selectedUnit,
                ]}
                onPress={() => setMeasurementUnit(unit.id as 'metric' | 'imperial')}
              >
                <Icon
                  name={unit.icon}
                  size={24}
                  color={measurementUnit === unit.id ? '#5DB075' : '#666'}
                />
                <Text
                  style={[
                    styles.unitLabel,
                    measurementUnit === unit.id && styles.selectedUnitLabel,
                  ]}
                >
                  {unit.label}
                </Text>
                {measurementUnit === unit.id && (
                  <Icon name="check" size={24} color="#5DB075" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Metabyl v1.0.0</Text>
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
  section: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5DB075',
    marginBottom: 10,
    paddingLeft: 5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F8F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  unitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedUnit: {
    backgroundColor: '#E8F5E9',
  },
  unitLabel: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: '#666',
  },
  selectedUnitLabel: {
    color: '#5DB075',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
});

export default SettingsScreen; 
