import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { Crown, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export default function SubscriptionScreen() {
  const { isPremium, setPremium } = useSettingsStore();
  
  const handleUpgrade = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // In a real app, this would open a payment flow
    Alert.alert(
      "Passer à Premium",
      "Ceci ouvrirait un processus de paiement pour passer à Premium pour 2,99€/mois.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Simuler l'achat", 
          onPress: () => {
            setPremium(true);
            Alert.alert("Succès", "Vous êtes maintenant un utilisateur Premium !");
          }
        }
      ]
    );
  };
  
  const renderFeatureItem = (text: string, isPremiumFeature: boolean) => (
    <View style={styles.featureItem}>
      <Check size={20} color={isPremiumFeature ? colors.success : colors.textSecondary} />
      <Text style={[styles.featureText, !isPremiumFeature && styles.featureTextFree]}>
        {text}
      </Text>
    </View>
  );
  
  return (
    <>
      <Stack.Screen options={{ title: "Abonnement" }} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.crownContainer}>
            <Crown size={40} color={colors.warning} />
          </View>
          <Text style={styles.title}>Premium</Text>
          <Text style={styles.subtitle}>
            Débloquez toutes les fonctionnalités et tirez le meilleur parti de CardScan
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Gratuit</Text>
              <Text style={styles.planPrice}>0€</Text>
            </View>
            <View style={styles.planFeatures}>
              {renderFeatureItem('Scan jusqu\'à 3 cartes de visite', false)}
              {renderFeatureItem('Gestion de contacts basique', false)}
              {renderFeatureItem('Relances manuelles', false)}
            </View>
          </View>
          
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>RECOMMANDÉ</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, styles.premiumTitle]}>Premium</Text>
              <Text style={[styles.planPrice, styles.premiumPrice]}>2,99€</Text>
              <Text style={styles.planPeriod}>par mois</Text>
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
        
        {!isPremium ? (
          <Pressable 
            style={styles.upgradeButton} 
            onPress={handleUpgrade}
          >
            <Crown size={20} color="white" />
            <Text style={styles.upgradeButtonText}>Passer à Premium</Text>
          </Pressable>
        ) : (
          <View style={styles.currentPlanContainer}>
            <Check size={24} color={colors.success} />
            <Text style={styles.currentPlanText}>Vous êtes déjà abonné à Premium</Text>
          </View>
        )}
        
        <Text style={styles.termsText}>
          En passant à Premium, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
          Vous pouvez annuler votre abonnement à tout moment.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    gap: 24,
    marginBottom: 32,
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
  currentPlanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success + '15', // 15% opacity
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  currentPlanText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});