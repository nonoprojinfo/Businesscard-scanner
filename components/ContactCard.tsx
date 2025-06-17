import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Mail, Phone, Calendar } from 'lucide-react-native';
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
    return date.toLocaleDateString();
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
            <Text style={styles.company} numberOfLines={1}>{contact.company}</Text>
          ) : null}
          
          <View style={styles.contactInfo}>
            {contact.email ? (
              <View style={styles.infoItem}>
                <Mail size={14} color={colors.textSecondary} />
                <Text style={styles.infoText} numberOfLines={1}>{contact.email}</Text>
              </View>
            ) : null}
            
            {contact.phone ? (
              <View style={styles.infoItem}>
                <Phone size={14} color={colors.textSecondary} />
                <Text style={styles.infoText}>{contact.phone}</Text>
              </View>
            ) : null}
          </View>
        </View>
        
        {hasReminder && (
          <View style={styles.reminderContainer}>
            <Calendar size={14} color={colors.warning} />
            <Text style={styles.reminderText}>
              {formatDate(contact.reminderDate!)}
            </Text>
          </View>
        )}
      </View>
      
      {contact.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {contact.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {contact.tags.length > 2 && (
            <Text style={styles.moreTagsText}>+{contact.tags.length - 2}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: colors.highlight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.placeholder,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  contactInfo: {
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15', // 15% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    gap: 4,
  },
  reminderText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});