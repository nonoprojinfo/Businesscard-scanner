import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert 
} from 'react-native';
import { Stack } from 'expo-router';
import { CreditCard, Calendar, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export default function ManageSubscriptionScreen() {
  const { isPremium, setPremium } = useSettingsStore();
  
  const handleCancel = () => {
    Alert.alert(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler votre abonnement Premium ? Vous perdrez l'accès aux fonctionnalités Premium à la fin de votre période de facturation actuelle.",
      [
        { text: "Non", style: "cancel" },
        { 
          text: "Oui, annuler", 
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API to cancel the subscription
            Alert.alert(
              "Abonnement annulé",
              "Votre abonnement a été annulé. Vous aurez accès aux fonctionnalités Premium jusqu'à la fin de votre période de facturation actuelle."
            );
            // For demo purposes, we'll just set isPremium to false
            setPremium(false);
          }
        }
      ]
    );
  };
  
  if (!isPremium) {
    return (
      <>
        <Stack.Screen options={{ title: "Gérer l'abonnement" }} />
        
        <View style={styles.noSubscriptionContainer}>
          <AlertCircle size={64} color={colors.textSecondary} />
          <Text style={styles.noSubscriptionTitle}>Aucun abonnement actif</Text>
          <Text style={styles.noSubscriptionText}>
            Vous n'avez pas d'abonnement Premium actif. Passez à Premium pour accéder à toutes les fonctionnalités.
          </Text>
          <Pressable 
            style={styles.upgradeButton}
            onPress={() => Alert.alert("Passer à Premium", "Ceci ouvrirait un processus de paiement.")}
          >
            <Text style={styles.upgradeButtonText}>Passer à Premium</Text>
          </Pressable>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: "Gérer l'abonnement" }} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Abonnement actuel</Text>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>Premium</Text>
            <Text style={styles.planPrice}>2,99€/mois</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Prochaine facturation</Text>
              <Text style={styles.infoValue}>15 juillet 2025</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <CreditCard size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Méthode de paiement</Text>
              <Text style={styles.infoValue}>•••• •••• •••• 4242</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => Alert.alert("Modifier le mode de paiement", "Ceci ouvrirait un écran pour modifier votre mode de paiement.")}
          >
            <Text style={styles.actionButtonText}>Modifier le mode de paiement</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Annuler l'abonnement</Text>
          </Pressable>
        </View>
        
        <Text style={styles.disclaimer}>
          En annulant votre abonnement, vous conserverez l'accès aux fonctionnalités Premium jusqu'à la fin de votre période de facturation actuelle.
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPrice: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: colors.error + '10', // 10% opacity
    borderColor: colors.error + '30', // 30% opacity
  },
  cancelButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  noSubscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  noSubscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});