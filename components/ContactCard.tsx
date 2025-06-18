import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Mail, Phone, Calendar, Building2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Contact } from '@/types/contact';

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const router = useRouter();
  const hasReminder = !!contact.reminderDate;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  const handlePress = () => {
    router.push(`/contact/${contact.id}`);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
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
          </View>
          
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>{contact.name}</Text>
            
            {contact.company ? (
              <View style={styles.companyContainer}>
                <Building2 size={14} color={colors.textSecondary} />
                <Text style={styles.company} numberOfLines={1}>{contact.company}</Text>
              </View>
            ) : null}
            
            <View style={styles.contactInfo}>
              {contact.email ? (
                <View style={styles.infoItem}>
                  <Mail size={12} color={colors.textSecondary} />
                  <Text style={styles.infoText} numberOfLines={1}>{contact.email}</Text>
                </View>
              ) : null}
              
              {contact.phone ? (
                <View style={styles.infoItem}>
                  <Phone size={12} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{contact.phone}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {hasReminder && (
            <View style={styles.reminderContainer}>
              <Calendar size={12} color={colors.warning} />
              <Text style={styles.reminderText}>
                {formatDate(contact.reminderDate!)}
              </Text>
            </View>
          )}
          
          {contact.tags.length > 0 && (
            <View style={styles.tagsPreview}>
              <View style={styles.tagDot} />
              <Text style={styles.tagCount}>{contact.tags.length}</Text>
            </View>
          )}
        </View>
      </View>
      
      {contact.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {contact.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {contact.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{contact.tags.length - 3}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.placeholder,
  },
  initialsContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  company: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  contactInfo: {
    gap: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  reminderText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
  },
  tagsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  tagCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary + '12',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  moreTagsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});