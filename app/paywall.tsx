import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, Check, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function PaywallScreen() {
  const router = useRouter();
  const { completePaywall } = useAuthStore();
  const { setPremium } = useSettingsStore();
  
  const handleUpgrade = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // In a real app, this would open a payment flow
    Alert.alert(
      "Upgrade to Premium",
      "This would open a payment flow to upgrade to Premium for $2.99/month.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Simulate Purchase", 
          onPress: () => {
            setPremium(true);
            completePaywall();
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };
  
  const handleSkip = () => {
    completePaywall();
    router.replace('/(tabs)');
  };
  
  const renderFeatureItem = (text: string, isPremium: boolean) => (
    <View style={styles.featureItem}>
      {isPremium ? (
        <Check size={20} color={colors.success} />
      ) : (
        <Check size={20} color={colors.textSecondary} />
      )}
      <Text style={[styles.featureText, !isPremium && styles.featureTextFree]}>
        {text}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.crownContainer}>
            <Crown size={40} color={colors.warning} />
          </View>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock all features and get the most out of CardScan
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Free</Text>
              <Text style={styles.planPrice}>$0</Text>
            </View>
            <View style={styles.planFeatures}>
              {renderFeatureItem('Scan up to 3 business cards', false)}
              {renderFeatureItem('Basic contact management', false)}
              {renderFeatureItem('Manual follow-ups', false)}
            </View>
          </View>
          
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>RECOMMENDED</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, styles.premiumTitle]}>Premium</Text>
              <Text style={[styles.planPrice, styles.premiumPrice]}>$2.99</Text>
              <Text style={styles.planPeriod}>per month</Text>
            </View>
            <View style={styles.planFeatures}>
              {renderFeatureItem('Unlimited business cards', true)}
              {renderFeatureItem('Advanced contact management', true)}
              {renderFeatureItem('Automatic follow-up reminders', true)}
              {renderFeatureItem('Export contacts to CSV', true)}
              {renderFeatureItem('Enhanced OCR accuracy', true)}
              {renderFeatureItem('Priority support', true)}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <Pressable 
          style={styles.upgradeButton} 
          onPress={handleUpgrade}
        >
          <Crown size={20} color="white" />
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
        </Pressable>
        
        <Pressable 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Continue with Free Plan</Text>
        </Pressable>
        
        <Text style={styles.termsText}>
          By upgrading, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription anytime.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.warning + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  plansContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumCard: {
    borderColor: colors.warning,
    borderWidth: 2,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.warning,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  premiumTitle: {
    color: colors.warning,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  premiumPrice: {
    color: colors.warning,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  planFeatures: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
  },
  featureTextFree: {
    color: colors.textSecondary,
  },
  buttonsContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});