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
import { Crown, Check, X, Sparkles } from 'lucide-react-native';
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
    
    Alert.alert(
      "Passer à Premium",
      "Ceci ouvrirait un processus de paiement pour passer à Premium pour 2,99€/mois.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Simuler l'achat", 
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
            <View style={styles.sparkleContainer}>
              <Sparkles size={16} color={colors.accent} />
            </View>
          </View>
          <Text style={styles.title}>Débloquez tout le potentiel</Text>
          <Text style={styles.subtitle}>
            Passez à Premium et transformez votre façon de gérer vos contacts professionnels
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Gratuit</Text>
              <Text style={styles.planPrice}>0€</Text>
            </View>
            <View style={styles.planFeatures}>
              {renderFeatureItem('Jusqu\'à 3 cartes de visite', false)}
              {renderFeatureItem('Gestion de contacts basique', false)}
              {renderFeatureItem('Rappels manuels', false)}
            </View>
          </View>
          
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>RECOMMANDÉ</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, styles.premiumTitle]}>Premium</Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.planPrice, styles.premiumPrice]}>2,99€</Text>
                <Text style={styles.planPeriod}>par mois</Text>
              </View>
            </View>
            <View style={styles.planFeatures}>
              {renderFeatureItem('Cartes de visite illimitées', true)}
              {renderFeatureItem('Gestion de contacts avancée', true)}
              {renderFeatureItem('Rappels de suivi automatiques', true)}
              {renderFeatureItem('Export des contacts en CSV', true)}
              {renderFeatureItem('Précision OCR améliorée', true)}
              {renderFeatureItem('Support prioritaire', true)}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.upgradeButton,
            pressed && styles.upgradeButtonPressed
          ]} 
          onPress={handleUpgrade}
        >
          <Crown size={20} color="white" />
          <Text style={styles.upgradeButtonText}>Passer à Premium</Text>
        </Pressable>
        
        <Pressable 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Continuer avec le plan gratuit</Text>
        </Pressable>
        
        <Text style={styles.termsText}>
          En passant à Premium, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
          Vous pouvez annuler votre abonnement à tout moment.
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
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  crownContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
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
    fontWeight: '500',
  },
  plansContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumCard: {
    borderColor: colors.warning,
    borderWidth: 2,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.warning,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  premiumTitle: {
    color: colors.warning,
  },
  priceContainer: {
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  premiumPrice: {
    color: colors.warning,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
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
    fontWeight: '500',
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
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});