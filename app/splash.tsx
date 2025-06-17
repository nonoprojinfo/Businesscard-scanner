import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  
  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();
    
    // Navigate after a delay
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (isOnboardingComplete) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/(auth)/login');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboardingComplete]);
  
  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop' }}
            style={styles.logoBackground}
            contentFit="cover"
          />
          <View style={styles.logoOverlay} />
        </View>
        <Text style={styles.appName}>CardScan</Text>
        <Text style={styles.tagline}>Your business cards, digitized</Text>
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
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  logoBackground: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});