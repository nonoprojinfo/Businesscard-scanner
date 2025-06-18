import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView,
  Pressable,
  Alert
} from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Clock, Calendar, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function NotificationsScreen() {
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [newFeatureNotifications, setNewFeatureNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  
  const handleTimeSelect = () => {
    // In a real app, this would open a time picker
    Alert.alert(
      "Sélectionner l'heure",
      "Ceci ouvrirait un sélecteur d'heure. Pour cette démo, nous utilisons une valeur fixe."
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Notifications" }} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Bell size={32} color={colors.primary} />
          </View>
          <Text style={styles.headerText}>
            Gérez vos préférences de notifications pour rester informé de vos suivis et des mises à jour importantes
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rappels</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Rappels de suivi</Text>
                <Text style={styles.settingDescription}>
                  Recevez des notifications pour vos rappels de suivi de contacts
                </Text>
              </View>
            </View>
            <Switch
              value={reminderNotifications}
              onValueChange={setReminderNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={reminderNotifications ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          {reminderNotifications && (
            <Pressable 
              style={styles.timeSelector}
              onPress={handleTimeSelect}
            >
              <View style={styles.timeSelectorInfo}>
                <Clock size={20} color={colors.primary} />
                <Text style={styles.timeSelectorText}>Heure des rappels</Text>
              </View>
              <Text style={styles.timeValue}>{reminderTime}</Text>
            </Pressable>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Info size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Nouvelles fonctionnalités</Text>
                <Text style={styles.settingDescription}>
                  Soyez informé des nouvelles fonctionnalités et améliorations
                </Text>
              </View>
            </View>
            <Switch
              value={newFeatureNotifications}
              onValueChange={setNewFeatureNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={newFeatureNotifications ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Marketing</Text>
                <Text style={styles.settingDescription}>
                  Recevez des offres spéciales et des conseils d'utilisation
                </Text>
              </View>
            </View>
            <Switch
              value={marketingNotifications}
              onValueChange={setMarketingNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '70' }}
              thumbColor={marketingNotifications ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Info size={18} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Vous pouvez également gérer les notifications dans les paramètres de votre appareil.
          </Text>
        </View>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  timeSelectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSelectorText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});