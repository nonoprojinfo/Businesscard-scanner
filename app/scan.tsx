import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Scanner } from '@/components/Scanner';
import { ContactForm } from '@/components/ContactForm';
import { useContactStore } from '@/store/contactStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ContactFormData } from '@/types/contact';

export default function ScanScreen() {
  const router = useRouter();
  const { addContact } = useContactStore();
  const { canAddContact, incrementContactsCount } = useSettingsStore();
  const [scannedData, setScannedData] = useState<ContactFormData | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleScanComplete = (data: ContactFormData, imageUri: string) => {
    setScannedData(data);
    setScannedImage(imageUri);
  };
  
  const handleSubmit = async (data: ContactFormData) => {
    if (!canAddContact()) {
      // Navigate to profile to show upgrade options
      router.push('/profile');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we might do some processing here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addContact(data, scannedImage || undefined);
      incrementContactsCount();
      
      // Navigate to the contacts list
      router.push('/');
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {scannedData ? (
        <ContactForm 
          initialData={scannedData}
          imageUri={scannedImage || undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      ) : (
        <Scanner onScanComplete={handleScanComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});