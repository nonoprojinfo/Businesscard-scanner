import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Crown, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface PremiumBannerProps {
  contactsCount: number;
  maxFreeContacts: number;
  onUpgrade: () => void;
}

export const PremiumBanner: React.FC<PremiumBannerProps> = ({ 
  contactsCount, 
  maxFreeContacts,
  onUpgrade
}) => {
  const remainingContacts = maxFreeContacts - contactsCount;
  const percentUsed = (contactsCount / maxFreeContacts) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Crown size={24} color={colors.warning} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {remainingContacts > 0 
              ? `${remainingContacts} contact${remainingContacts > 1 ? 's' : ''} gratuit${remainingContacts > 1 ? 's' : ''} restant${remainingContacts > 1 ? 's' : ''}` 
              : 'Limite gratuite atteinte'}
          </Text>
          <Text style={styles.description}>
            {remainingContacts > 0 
              ? 'Passez à Premium pour des contacts illimités' 
              : 'Débloquez des contacts illimités avec Premium'}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${Math.min(percentUsed, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {contactsCount}/{maxFreeContacts}
            </Text>
          </View>
        </View>
      </View>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]} 
        onPress={onUpgrade}
      >
        <Text style={styles.buttonText}>Premium</Text>
        <ArrowRight size={16} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '08',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.warning,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 32,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    marginLeft: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});