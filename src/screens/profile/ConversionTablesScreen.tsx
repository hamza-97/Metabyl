import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ConversionTablesScreen = () => {
  const [activeTab, setActiveTab] = useState('volume');

  const tabs = [
    { id: 'volume', label: 'Volume', icon: 'cup' },
    { id: 'weight', label: 'Weight', icon: 'weight' },
    { id: 'temperature', label: 'Temperature', icon: 'thermometer' },
    { id: 'kitchen', label: 'Kitchen', icon: 'food-variant' },
  ];

  const renderVolumeConversions = () => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Metric to US Volume</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Metric Volume</Text>
          <Text style={styles.headerCell}>US Volume Equivalent</Text>
        </View>
        {[
          { metric: '1 milliliter (ml)', us: '0.034 fluid ounces (fl oz)' },
          { metric: '5 ml', us: '1 teaspoon (tsp)' },
          { metric: '15 ml', us: '1 tablespoon (tbsp)' },
          { metric: '30 ml', us: '2 tablespoons = 1 fl oz' },
          { metric: '60 ml', us: '4 tablespoons = 1/4 cup' },
          { metric: '120 ml', us: '1/2 cup' },
          { metric: '240 ml', us: '1 cup' },
          { metric: '475 ml', us: '2 cups = 1 pint' },
          { metric: '950 ml', us: '4 cups = 1 quart' },
          { metric: '3,785 ml', us: '1 gallon' },
        ].map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : {}]}>
            <Text style={styles.cell}>{item.metric}</Text>
            <Text style={styles.cell}>{item.us}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.tableTitle, { marginTop: 30 }]}>US to Metric Volume</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>US Volume</Text>
          <Text style={styles.headerCell}>Metric Equivalent</Text>
        </View>
        {[
          { us: '1 teaspoon', metric: '~5 ml' },
          { us: '1 tablespoon', metric: '~15 ml' },
          { us: '1 fluid ounce', metric: '~30 ml' },
          { us: '1 cup', metric: '~240 ml' },
          { us: '1 pint', metric: '~475 ml' },
          { us: '1 quart', metric: '~950 ml' },
          { us: '1 gallon', metric: '~3.8 liters' },
        ].map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : {}]}>
            <Text style={styles.cell}>{item.us}</Text>
            <Text style={styles.cell}>{item.metric}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderWeightConversions = () => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Weight Conversions</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Weight (US)</Text>
          <Text style={styles.headerCell}>Metric Equivalent</Text>
        </View>
        {[
          { us: '1 ounce (oz)', metric: '28 grams (g)' },
          { us: '1 pound (lb)', metric: '454 grams (g)' },
          { us: '2.2 pounds', metric: '1 kilogram (kg)' },
        ].map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : {}]}>
            <Text style={styles.cell}>{item.us}</Text>
            <Text style={styles.cell}>{item.metric}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTemperatureConversions = () => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Temperature Conversions</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>°C (Celsius)</Text>
          <Text style={styles.headerCell}>°F (Fahrenheit)</Text>
        </View>
        {[
          { celsius: '100 °C', fahrenheit: '212 °F (boiling)' },
          { celsius: '180 °C', fahrenheit: '356 °F (baking)' },
          { celsius: '200 °C', fahrenheit: '392 °F' },
          { celsius: '220 °C', fahrenheit: '428 °F' },
        ].map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : {}]}>
            <Text style={styles.cell}>{item.celsius}</Text>
            <Text style={styles.cell}>{item.fahrenheit}</Text>
          </View>
        ))}
      </View>

      <View style={styles.formulaContainer}>
        <Text style={styles.formulaTitle}>Conversion Formula:</Text>
        <Text style={styles.formula}>(°C × 1.8) + 32 = °F</Text>
      </View>
    </View>
  );

  const renderKitchenConversions = () => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Common Kitchen Conversions</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>US Measure</Text>
          <Text style={styles.headerCell}>US Equivalent</Text>
        </View>
        {[
          { measure: '3 teaspoons', equivalent: '1 tablespoon' },
          { measure: '2 tablespoons', equivalent: '1 fluid ounce' },
          { measure: '4 tablespoons', equivalent: '1/4 cup' },
          { measure: '5 tablespoons + 1 tsp', equivalent: '1/3 cup' },
          { measure: '8 tablespoons', equivalent: '1/2 cup' },
          { measure: '16 tablespoons', equivalent: '1 cup' },
          { measure: '2 cups', equivalent: '1 pint' },
          { measure: '4 cups', equivalent: '1 quart' },
          { measure: '16 cups', equivalent: '1 gallon' },
        ].map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : {}]}>
            <Text style={styles.cell}>{item.measure}</Text>
            <Text style={styles.cell}>{item.equivalent}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'volume':
        return renderVolumeConversions();
      case 'weight':
        return renderWeightConversions();
      case 'temperature':
        return renderTemperatureConversions();
      case 'kitchen':
        return renderKitchenConversions();
      default:
        return renderVolumeConversions();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id ? styles.activeTab : {}]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#5DB075' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id ? styles.activeTabText : {},
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Icon name="ruler" size={24} color="#5DB075" />
          <Text style={styles.mainTitle}>Cooking Measurements</Text>
        </View>
        {renderActiveTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5DB075',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#5DB075',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#5DB075',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  evenRow: {
    backgroundColor: '#F9F9F9',
  },
  cell: {
    flex: 1,
    fontSize: 15,
  },
  formulaContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  formula: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConversionTablesScreen; 
