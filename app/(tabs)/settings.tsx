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
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  Crown, 
  CreditCard, 
  Download, 
  Bell, 
  HelpCircle, 
  Mail, 
  LogOut, 
  ChevronRight 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useContactStore } from '@/store/contactStore';
import { useAuthStore } from '@/store/authStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setPremium, contactsCount, maxFreeContacts } = useSettingsStore();
  const { contacts } = useContactStore();
  const { user, logout } = useAuthStore();
  
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
  
  const handleExport = () => {
    if (!isPremium) {
      Alert.alert(
        "Fonctionnalité Premium",
        "L'exportation des contacts est une fonctionnalité Premium. Passez à Premium pour y accéder.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Passer à Premium", onPress: handleUpgrade }
        ]
      );
      return;
    }
    
    router.push('/settings/export');
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Déconnexion", 
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };
  
  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onPress: () => void,
    isPremiumFeature = false
  ) => (
    <Pressable 
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemIcon}>
          {icon}
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      {isPremiumFeature && !isPremium ? (
        <View style={styles.premiumBadge}>
          <Crown size={12} color="white" />
          <Text style={styles.premiumBadgeText}>PRO</Text>
        </View>
      ) : (
        <ChevronRight size={20} color={colors.textSecondary} />
      )}
    </Pressable>
  );
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
            style={styles.profileImage}
            contentFit="cover"
          />
        </View>
        <Text style={styles.profileName}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'utilisateur@exemple.com'}</Text>
        
        {!isPremium && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {contactsCount}/{maxFreeContacts} contacts gratuits utilisés
            </Text>
            <Pressable 
              style={styles.upgradeButton}
              onPress={handleUpgrade}
            >
              <Crown size={16} color="white" />
              <Text style={styles.upgradeButtonText}>Passer à Premium</Text>
            </Pressable>
          </View>
        )}
        
        {isPremium && (
          <View style={styles.premiumContainer}>
            <Crown size={20} color={colors.warning} />
            <Text style={styles.premiumText}>Membre Premium</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abonnement</Text>
        {renderMenuItem(
          <Crown size={22} color={colors.warning} />,
          "Plan Premium",
          isPremium ? "Actif" : "Débloquez les contacts illimités et plus",
          () => router.push('/settings/subscription')
        )}
        {renderMenuItem(
          <CreditCard size={22} color={colors.primary} />,
          "Gérer l'abonnement",
          "Modifier ou annuler votre plan",
          () => router.push('/settings/manage-subscription')
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Données</Text>
        {renderMenuItem(
          <Download size={22} color={colors.primary} />,
          "Exporter les contacts",
          "Télécharger au format CSV",
          handleExport,
          true
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        {renderMenuItem(
          <Bell size={22} color={colors.primary} />,
          "Notifications",
          "Gérer les rappels et alertes",
          () => router.push('/settings/notifications')
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {renderMenuItem(
          <HelpCircle size={22} color={colors.primary} />,
          "Aide & Support",
          "Obtenir de l'aide avec l'application",
          () => router.push('/settings/help')
        )}
        {renderMenuItem(
          <Mail size={22} color={colors.primary} />,
          "Contactez-nous",
          "Envoyez-nous vos commentaires ou signalez des problèmes",
          () => router.push('/settings/contact-us')
        )}
      </View>
      
      <Pressable 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </Pressable>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.placeholder,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  premiumContainer: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '15', // 15% opacity
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  premiumText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemPressed: {
    opacity: 0.8,
    backgroundColor: colors.highlight,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  premiumBadge: {
    flexDirection: 'row',
    backgroundColor: colors.warning,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.error + '10', // 10% opacity
    gap: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    color: colors.textSecondary,
  },
});