import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasSeenThankYou, hasSeenPaywall } = useAuthStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);
  
  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
    
    // Navigate after a delay
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (!hasSeenThankYou) {
          router.replace('/thank-you');
        } else if (!hasSeenPaywall) {
          router.replace('/paywall');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(auth)/register');
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, hasSeenThankYou, hasSeenPaywall]);
  
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
        
        <Animated.View style={{
          transform: [{ translateY: slideAnim }]
        }}>
          <Text style={styles.appName}>CardScan</Text>
          <Text style={styles.tagline}>Vos cartes de visite, numérisées</Text>
        </Animated.View>
      </Animated.View>
      
      <View style={styles.footer}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
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
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoBackground: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 17,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});