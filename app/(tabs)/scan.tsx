import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Scanner } from '@/components/Scanner';
import { useContactStore } from '@/store/contactStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ContactFormData } from '@/types/contact';

export default function ScanScreen() {
  const router = useRouter();
  const { addContact } = useContactStore();
  const { canAddContact, incrementContactsCount } = useSettingsStore();
  
  const handleScanComplete = (data: ContactFormData, imageUri: string) => {
    if (!canAddContact()) {
      // Navigate to profile to show upgrade options
      router.push('/profile');
      return;
    }
    
    addContact(data, imageUri);
    incrementContactsCount();
    
    // Navigate to the contacts list
    router.push('/');
  };
  
  return (
    <View style={styles.container}>
      <Scanner onScanComplete={handleScanComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});