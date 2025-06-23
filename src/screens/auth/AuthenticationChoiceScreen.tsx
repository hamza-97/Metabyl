import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useUserStore } from '../../store/userStore';

type AuthChoiceNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AuthChoice'
>;

const AuthenticationChoiceScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<AuthChoiceNavigationProp>();
  const { setAuthMethod } = useUserStore();

  const handleAppleSignIn = async () => {
    try {
      // TODO: Implement Apple Sign In
      console.log('Apple Sign In pressed');
      setAuthMethod('apple');
      navigation.navigate('PaywallScreen');
    } catch (error) {
      console.error('Apple Sign In failed:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google Sign In
      console.log('Google Sign In pressed');
      setAuthMethod('google');
      navigation.navigate('PaywallScreen');
    } catch (error) {
      console.error('Google Sign In failed:', error);
    }
  };

  const handleContinueWithoutAccount = () => {
    setAuthMethod('local');
    navigation.navigate('PaywallScreen');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'} 
      />
      
      {/* Background gradient */}
      <View style={[styles.backgroundGradient, isDarkMode && styles.backgroundGradientDark]} />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, isDarkMode && styles.logoContainerDark]}>
            <Icon name="content-save" size={32} color="#5DB075" />
          </View>
          
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Save Your Progress
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.textLightSecondary]}>
            Secure your personalized meal plan and sync across devices
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.appleButton]} 
            onPress={handleAppleSignIn}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <View style={styles.appleIconBg}>
                <Icon name="apple" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.appleButtonText}>Save with Apple ID</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#FFFFFF" style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.googleButton, isDarkMode && styles.googleButtonDark]} 
            onPress={handleGoogleSignIn}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <View style={styles.googleIconBg}>
                <Icon name="google" size={20} color="#4285F4" />
              </View>
              <Text style={[styles.googleButtonText, isDarkMode && styles.googleButtonTextDark]}>
                Save with Google
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color="#999999" style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
            <Text style={[styles.dividerText, isDarkMode && styles.textLightSecondary]}>or</Text>
            <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.skipButton, isDarkMode && styles.skipButtonDark]} 
            onPress={handleContinueWithoutAccount}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.skipIconBg, isDarkMode && styles.skipIconBgDark]}>
                <Icon name="phone" size={20} color="#5DB075" />
              </View>
              <Text style={[styles.skipButtonText, isDarkMode && styles.skipButtonTextDark]}>
                Skip for now
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color="#5DB075" style={styles.chevron} />
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <View style={[styles.benefitsContainer, isDarkMode && styles.benefitsContainerDark]}>
            <View style={styles.benefitRow}>
              <Icon name="sync" size={16} color="#5DB075" />
              <Text style={[styles.benefitText, isDarkMode && styles.textLightSecondary]}>
                Access your meal plans on all devices
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <Icon name="shield-check" size={16} color="#5DB075" />
              <Text style={[styles.benefitText, isDarkMode && styles.textLightSecondary]}>
                Never lose your personalized preferences
              </Text>
            </View>
          </View>
          <Text style={[styles.footerText, isDarkMode && styles.textLightSecondary]}>
            You can always create an account later in settings
          </Text>
        </View>
      </View>
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAFFFE',
  },
  backgroundGradientDark: {
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 50,
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
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  googleButtonDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
  },
  googleIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonTextDark: {
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerLineDark: {
    backgroundColor: '#333333',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  skipButton: {
    backgroundColor: '#F8FFF9',
    borderWidth: 1.5,
    borderColor: '#E8F5E8',
  },
  skipButtonDark: {
    backgroundColor: '#1A2A1A',
    borderColor: '#2A4A2A',
  },
  skipIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  skipIconBgDark: {
    backgroundColor: '#2A4A2A',
  },
  skipButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButtonTextDark: {
    color: '#FFFFFF',
  },
  chevron: {
    opacity: 0.6,
  },
  footerSection: {
    paddingTop: 40,
  },
  benefitsContainer: {
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  benefitsContainerDark: {
    backgroundColor: '#1A2A1A',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textLightSecondary: {
    color: '#AAAAAA',
  },
});

export default AuthenticationChoiceScreen; 
