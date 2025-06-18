import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ArrowRight, Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function ThankYouScreen() {
  const router = useRouter();
  const { completeThankYou } = useAuthStore();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    // Animate check mark
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(2)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    // Fade in text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
    
    // Auto-proceed after 3 seconds
    const timer = setTimeout(() => {
      handleContinue();
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    completeThankYou();
    router.replace('/paywall');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.checkmarkContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Check size={48} color="white" />
          <View style={styles.sparkleContainer}>
            <Sparkles size={20} color={colors.accent} />
          </View>
        </Animated.View>
        
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <Text style={styles.title}>Bienvenue dans CardScan !</Text>
          <Text style={styles.message}>
            Votre compte a été créé avec succès. Nous sommes ravis de vous aider à gérer vos contacts professionnels de manière intelligente.
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Scan instantané des cartes</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Organisation automatique</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Rappels intelligents</Text>
            </View>
          </View>
        </Animated.View>
      </View>
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <Pressable 
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed
          ]} 
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Commencer</Text>
          <ArrowRight size={20} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  checkmarkContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 32,
    fontWeight: '500',
  },
  features: {
    gap: 12,
    alignItems: 'flex-start',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  featureText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});