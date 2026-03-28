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
  ChevronRight,
  User,
  Shield
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
    isPremiumFeature = false,
    showChevron = true
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
      ) : showChevron ? (
        <ChevronRight size={20} color={colors.textSecondary} />
      ) : null}
    </Pressable>
  );
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
              style={styles.profileImage}
              contentFit="cover"
            />
            <View style={styles.statusIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Utilisateur'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'utilisateur@exemple.com'}</Text>
            
            {isPremium ? (
              <View style={styles.premiumContainer}>
                <Crown size={16} color={colors.warning} />
                <Text style={styles.premiumText}>Membre Premium</Text>
              </View>
            ) : (
              <View style={styles.freeContainer}>
                <Text style={styles.freeText}>
                  {contactsCount}/{maxFreeContacts} contacts gratuits
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {!isPremium && (
          <Pressable 
            style={styles.upgradeCard}
            onPress={handleUpgrade}
          >
            <View style={styles.upgradeContent}>
              <Crown size={24} color={colors.warning} />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>Passer à Premium</Text>
                <Text style={styles.upgradeSubtitle}>Contacts illimités et plus</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.warning} />
          </Pressable>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        {renderMenuItem(
          <User size={22} color={colors.primary} />,
          "Profil",
          "Gérer vos informations personnelles",
          () => Alert.alert("Profil", "Ceci ouvrirait la page de profil.")
        )}
        {renderMenuItem(
          <Shield size={22} color={colors.primary} />,
          "Confidentialité",
          "Paramètres de confidentialité et sécurité",
          () => Alert.alert("Confidentialité", "Ceci ouvrirait les paramètres de confidentialité.")
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
          "Envoyez-nous vos commentaires",
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.placeholder,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  premiumContainer: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '15',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  premiumText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '700',
  },
  freeContainer: {
    alignSelf: 'flex-start',
  },
  freeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.warning + '08',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  premiumBadge: {
    flexDirection: 'row',
    backgroundColor: colors.warning,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.error + '08',
    borderWidth: 1,
    borderColor: colors.error + '20',
    gap: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});