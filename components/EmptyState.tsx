import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScanLine, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No contacts yet",
  description = "Scan business cards to add contacts to your collection"
}) => {
  const router = useRouter();
  
  const handleScan = () => {
    router.push('/scan');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <ScanLine size={64} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Pressable style={styles.button} onPress={handleScan}>
        <Plus size={20} color="white" />
        <Text style={styles.buttonText}>Scan Business Card</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});