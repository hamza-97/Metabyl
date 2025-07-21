import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DiscountOfferModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const DiscountOfferModal: React.FC<DiscountOfferModalProps> = ({
  visible,
  onClose,
  onSubscribe,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={20} color="#666666" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>40%</Text>
              <Text style={styles.offText}>OFF</Text>
            </View>
            <Text style={styles.limitedTimeText}>🔥 Limited Time Offer!</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Wait! Don't Miss Out</Text>
            <Text style={styles.subtitle}>
              Get 40% off your first month of Metabyl Premium
            </Text>
            
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>What you'll get:</Text>
              <View style={styles.benefitItem}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>Unlimited personalized meal plans</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>Smart shopping lists</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>Premium recipes & nutrition insights</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>Was $9.99/month</Text>
              <Text style={styles.discountPrice}>Now just $5.99/month</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
              <Text style={styles.subscribeButtonText}>Claim 40% Discount Now!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipButton} onPress={onClose}>
              <Text style={styles.skipButtonText}>No thanks, continue with free version</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: SCREEN_WIDTH - 40,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    lineHeight: 24,
  },
  offText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
    letterSpacing: 1,
  },
  limitedTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  subscribeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#999999',
    fontSize: 14,
  },
}); 
