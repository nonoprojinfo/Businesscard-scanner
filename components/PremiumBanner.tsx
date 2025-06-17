import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Crown } from 'lucide-react-native';
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
          <Crown size={20} color={colors.warning} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {remainingContacts > 0 
              ? `${remainingContacts} free contacts remaining` 
              : 'Free limit reached'}
          </Text>
          <Text style={styles.description}>
            {remainingContacts > 0 
              ? 'Upgrade to Premium for unlimited contacts and more features' 
              : 'Upgrade to Premium to add more contacts'}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(percentUsed, 100)}%` }]} />
            <Text style={styles.progressText}>
              {contactsCount}/{maxFreeContacts}
            </Text>
          </View>
        </View>
      </View>
      
      <Pressable style={styles.button} onPress={onUpgrade}>
        <Text style={styles.buttonText}>Upgrade</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '10', // 10% opacity
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.warning + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: colors.warning,
  },
  progressText: {
    position: 'absolute',
    top: 8,
    right: 0,
    fontSize: 10,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});