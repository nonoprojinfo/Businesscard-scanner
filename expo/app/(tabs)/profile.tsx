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
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
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
      "Upgrade to Premium",
      "This would open a payment flow to upgrade to Premium for $2.99/month.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Simulate Purchase", 
          onPress: () => {
            setPremium(true);
            Alert.alert("Success", "You are now a Premium user!");
          }
        }
      ]
    );
  };
  
  const handleExport = () => {
    if (!isPremium) {
      Alert.alert(
        "Premium Feature",
        "Exporting contacts is a Premium feature. Upgrade to access this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade", onPress: handleUpgrade }
        ]
      );
      return;
    }
    
    // In a real app, this would generate and share a CSV file
    Alert.alert("Export Successful", "Your contacts have been exported.");
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
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
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        
        {!isPremium && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {contactsCount}/{maxFreeContacts} free contacts used
            </Text>
            <Pressable 
              style={styles.upgradeButton}
              onPress={handleUpgrade}
            >
              <Crown size={16} color="white" />
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </Pressable>
          </View>
        )}
        
        {isPremium && (
          <View style={styles.premiumContainer}>
            <Crown size={20} color={colors.warning} />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        {renderMenuItem(
          <Crown size={22} color={colors.warning} />,
          "Premium Plan",
          isPremium ? "Active" : "Unlock unlimited contacts and more",
          handleUpgrade
        )}
        {renderMenuItem(
          <CreditCard size={22} color={colors.primary} />,
          "Manage Subscription",
          "Change or cancel your plan",
          () => Alert.alert("Manage Subscription", "This would open subscription management.")
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        {renderMenuItem(
          <Download size={22} color={colors.primary} />,
          "Export Contacts",
          "Download as CSV file",
          handleExport,
          true
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {renderMenuItem(
          <Bell size={22} color={colors.primary} />,
          "Notifications",
          "Manage reminders and alerts",
          () => Alert.alert("Notifications", "This would open notification settings.")
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {renderMenuItem(
          <HelpCircle size={22} color={colors.primary} />,
          "Help & Support",
          "Get help with the app",
          () => Alert.alert("Help & Support", "This would open help resources.")
        )}
        {renderMenuItem(
          <Mail size={22} color={colors.primary} />,
          "Contact Us",
          "Send us feedback or report issues",
          () => Alert.alert("Contact Us", "This would open a contact form.")
        )}
      </View>
      
      <Pressable 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
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