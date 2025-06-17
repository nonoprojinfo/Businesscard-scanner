import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ContactForm } from '@/components/ContactForm';
import { useContactStore } from '@/store/contactStore';
import { ContactFormData } from '@/types/contact';

export default function EditContactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getContactById, updateContact } = useContactStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const contact = getContactById(id);
  
  if (!contact) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  const initialData: ContactFormData = {
    name: contact.name,
    company: contact.company,
    email: contact.email,
    phone: contact.phone,
    position: contact.position,
    website: contact.website,
    address: contact.address,
    notes: contact.notes,
    tags: [...contact.tags],
  };
  
  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we might do some processing here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateContact(contact.id, data);
      
      // Navigate back to contact details
      router.back();
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <ContactForm 
        initialData={initialData}
        imageUri={contact.imageUri}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});