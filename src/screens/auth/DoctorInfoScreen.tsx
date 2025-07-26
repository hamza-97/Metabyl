import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import OnboardingScreenWrapper from '../../components/common/OnboardingScreenWrapper';

type DoctorInfoNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DoctorInfo'
>;

const DoctorInfoScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<DoctorInfoNavigationProp>();

  const handleContinue = () => {
    // navigation.navigate('AuthChoice');
    navigation.navigate('PaywallScreen');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
    <OnboardingScreenWrapper>
      <View style={[styles.container, isDarkMode && styles.containerDark]}>

      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, isDarkMode && styles.logoContainerDark]}>
            <Icon name="shield-check" size={32} color="#5DB075" />
          </View>
          
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Medically Verified
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
            Metabyl is certified by medical professionals specializing in metabolic health
          </Text>
        </View>

        <View style={[styles.doctorCard, isDarkMode && styles.doctorCardDark]}>
          <Image 
            source={require('../../../assets/img/Dr.png')} 
            style={styles.doctorImage}
            resizeMode="cover"
          />
          
          <View style={styles.doctorInfo}>
            <Text style={[styles.doctorName, isDarkMode && styles.textLight]}>
              Dr. Michael W. Jones
            </Text>
            <Text style={[styles.doctorTitle, isDarkMode && styles.textLightSecondary]}>
            Obesity Medicine/Cardio-Metabolic Health Physician
            </Text>
            <Text style={[styles.doctorLocation, isDarkMode && styles.textLightSecondary]}>
              Lynchburg, Virginia
            </Text>
          </View>
        </View>

        <View style={[styles.missionSection, isDarkMode && styles.missionSectionDark]}>
          <Text style={[styles.missionText, isDarkMode && styles.textLightSecondary]}>
            Metabyl is a personalized meal planning app that helps individuals, families, and clinicians reclaim metabolic health through realistic, evidence-based menus that fit real life. Unlike generic diet apps or rigid templates, Metabyl blends medical accuracy, user customization, and flexible planning into one seamless tool that fuels lasting change.
          </Text>
        </View>

        <View style={styles.credentialsSection}>
          <View style={styles.credentialItem}>
            <View style={[styles.credentialIcon, isDarkMode && styles.credentialIconDark]}>
              <Icon name="school" size={20} color="#5DB075" />
            </View>
            <View style={styles.credentialText}>
              <Text style={[styles.credentialTitle, isDarkMode && styles.textLight]}>
                Medical Education
              </Text>
              <Text style={[styles.credentialDesc, isDarkMode && styles.textLightSecondary]}>
                Kansas City University of Medicine and Biosciences, St. Louis University School of Medicine Residency
              </Text>
            </View>
          </View>

          <View style={styles.credentialItem}>
            <View style={[styles.credentialIcon, isDarkMode && styles.credentialIconDark]}>
              <Icon name="hospital-building" size={20} color="#5DB075" />
            </View>
            <View style={styles.credentialText}>
              <Text style={[styles.credentialTitle, isDarkMode && styles.textLight]}>
                Affiliated Hospital
              </Text>
              <Text style={[styles.credentialDesc, isDarkMode && styles.textLightSecondary]}>
                Centra Lynchburg General Hospital
              </Text>
            </View>
          </View>

          <View style={styles.credentialItem}>
            <View style={[styles.credentialIcon, isDarkMode && styles.credentialIconDark]}>
              <Icon name="clock-time-four" size={20} color="#5DB075" />
            </View>
            <View style={styles.credentialText}>
              <Text style={[styles.credentialTitle, isDarkMode && styles.textLight]}>
                Experience
              </Text>
              <Text style={[styles.credentialDesc, isDarkMode && styles.textLightSecondary]}>
                20+ years in practice
              </Text>
            </View>
          </View>

          <View style={styles.credentialItem}>
            <View style={[styles.credentialIcon, isDarkMode && styles.credentialIconDark]}>
              <Icon name="medical-bag" size={20} color="#5DB075" />
            </View>
            <View style={styles.credentialText}>
              <Text style={[styles.credentialTitle, isDarkMode && styles.textLight]}>
                Specializations
              </Text>
              <Text style={[styles.credentialDesc, isDarkMode && styles.textLightSecondary]}>
                Obesity Medicine & Nutrition, Diabetes, Hypertension, Cardiometabolic Disease Management and Prevention
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.trustSection, isDarkMode && styles.trustSectionDark]}>
          <Icon name="shield-crown-outline" size={24} color="#5DB075" />
          <Text style={[styles.trustTitle, isDarkMode && styles.textLight]}>
            Patient-Centered Care
          </Text>
          <Text style={[styles.trustDesc, isDarkMode && styles.textLightSecondary]}>
            Dr. Jones is recognized for making time for patients and providing evidence-based treatment for metabolic health conditions
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      </View>
    </OnboardingScreenWrapper>
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
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#5DB075',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainerDark: {
    backgroundColor: '#1A2A1A',
    shadowColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorCardDark: {
    backgroundColor: '#2A2A2A',
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  doctorTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  doctorLocation: {
    fontSize: 14,
    color: '#999999',
  },
  missionSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#5DB075',
  },
  missionSectionDark: {
    backgroundColor: '#1E2A3A',
    borderLeftColor: '#5DB075',
  },
  missionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A5568',
    textAlign: 'left',
  },
  credentialsSection: {
    marginBottom: 30,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  credentialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  credentialIconDark: {
    backgroundColor: '#1A2A1A',
  },
  credentialText: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  credentialDesc: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  trustSection: {
    backgroundColor: '#F0F9F0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  trustSectionDark: {
    backgroundColor: '#1A2A1A',
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },
  trustDesc: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 34,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#5DB075',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5DB075',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default DoctorInfoScreen; 
