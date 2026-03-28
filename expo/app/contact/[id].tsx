import React, { useState } from 'react';
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
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  FileText, 
  Calendar, 
  Edit2, 
  Trash2, 
  Share2, 
  Bell 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { colors } from '@/constants/colors';
import { useContactStore } from '@/store/contactStore';
import { ReminderModal } from '@/components/ReminderModal';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getContactById, deleteContact, setReminder } = useContactStore();
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  
  const contact = getContactById(id);
  
  if (!contact) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Contact introuvable</Text>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </Pressable>
      </View>
    );
  }
  
  const handleEdit = () => {
    router.push({
      pathname: '/contact/edit',
      params: { id: contact.id }
    });
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Supprimer le contact",
      "Êtes-vous sûr de vouloir supprimer ce contact ? Cette action ne peut pas être annulée.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            deleteContact(contact.id);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleShare = () => {
    // In a real app, this would use the Share API
    Alert.alert("Partager le contact", "Ceci ouvrirait la boîte de dialogue de partage.");
  };
  
  const handleCall = () => {
    if (contact.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };
  
  const handleEmail = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };
  
  const handleWebsite = () => {
    if (contact.website) {
      let url = contact.website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      Linking.openURL(url);
    }
  };
  
  const handleMap = () => {
    if (contact.address) {
      const query = encodeURIComponent(contact.address);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };
  
  const handleSetReminder = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setReminderModalVisible(true);
  };
  
  const handleConfirmReminder = (date: number) => {
    setReminder(contact.id, date);
    setReminderModalVisible(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: contact.name,
          headerRight: () => (
            <Pressable 
              onPress={handleEdit}
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Edit2 size={20} color={colors.primary} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {contact.imageUri ? (
            <Image
              source={{ uri: contact.imageUri }}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <Text style={styles.name}>{contact.name}</Text>
          
          {contact.company ? (
            <Text style={styles.company}>{contact.company}</Text>
          ) : null}
          
          {contact.position ? (
            <Text style={styles.position}>{contact.position}</Text>
          ) : null}
          
          {contact.reminderDate ? (
            <View style={styles.reminderBadge}>
              <Calendar size={16} color={colors.warning} />
              <Text style={styles.reminderText}>
                Suivi le {formatDate(contact.reminderDate)}
              </Text>
            </View>
          ) : null}
          
          <View style={styles.actionButtons}>
            {contact.phone ? (
              <Pressable 
                style={styles.actionButton} 
                onPress={handleCall}
              >
                <View style={[styles.actionIcon, styles.callIcon]}>
                  <Phone size={20} color="white" />
                </View>
                <Text style={styles.actionText}>Appeler</Text>
              </Pressable>
            ) : null}
            
            {contact.email ? (
              <Pressable 
                style={styles.actionButton} 
                onPress={handleEmail}
              >
                <View style={[styles.actionIcon, styles.emailIcon]}>
                  <Mail size={20} color="white" />
                </View>
                <Text style={styles.actionText}>Email</Text>
              </Pressable>
            ) : null}
            
            <Pressable 
              style={styles.actionButton} 
              onPress={handleSetReminder}
            >
              <View style={[styles.actionIcon, styles.reminderIcon]}>
                <Bell size={20} color="white" />
              </View>
              <Text style={styles.actionText}>Rappel</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          
          {contact.phone ? (
            <Pressable 
              style={styles.infoItem} 
              onPress={handleCall}
            >
              <Phone size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{contact.phone}</Text>
              </View>
            </Pressable>
          ) : null}
          
          {contact.email ? (
            <Pressable 
              style={styles.infoItem} 
              onPress={handleEmail}
            >
              <Mail size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{contact.email}</Text>
              </View>
            </Pressable>
          ) : null}
          
          {contact.website ? (
            <Pressable 
              style={styles.infoItem} 
              onPress={handleWebsite}
            >
              <Globe size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Site web</Text>
                <Text style={styles.infoValue}>{contact.website}</Text>
              </View>
            </Pressable>
          ) : null}
          
          {contact.address ? (
            <Pressable 
              style={styles.infoItem} 
              onPress={handleMap}
            >
              <MapPin size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Adresse</Text>
                <Text style={styles.infoValue}>{contact.address}</Text>
              </View>
            </Pressable>
          ) : null}
        </View>
        
        {contact.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesContainer}>
              <FileText size={20} color={colors.primary} />
              <Text style={styles.notesText}>{contact.notes}</Text>
            </View>
          </View>
        ) : null}
        
        {contact.tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {contact.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        
        <View style={styles.footer}>
          <Pressable 
            style={[styles.footerButton, styles.shareButton]} 
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.text} />
            <Text style={styles.shareButtonText}>Partager le contact</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.footerButton, styles.deleteButton]} 
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Supprimer le contact</Text>
          </Pressable>
        </View>
      </ScrollView>
      
      <ReminderModal
        visible={reminderModalVisible}
        onClose={() => setReminderModalVisible(false)}
        onSetReminder={handleConfirmReminder}
      />
    </>
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: colors.placeholder,
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initials: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  company: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  position: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  reminderBadge: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '15', // 15% opacity
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  reminderText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  callIcon: {
    backgroundColor: colors.success,
  },
  emailIcon: {
    backgroundColor: colors.primary,
  },
  reminderIcon: {
    backgroundColor: colors.warning,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
    gap: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: colors.error + '10', // 10% opacity
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
});