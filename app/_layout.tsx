import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const [isMounted, setIsMounted] = useState(false);
  const { 
    isAuthenticated, 
    isOnboardingComplete, 
    checkAuth, 
    hasSeenOnboarding, 
    hasSeenThankYou,
    hasSeenPaywall
  } = useAuthStore();

  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
    // Set mounted state after initial render
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run navigation logic after component is mounted
    if (!isMounted) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "onboarding";
    const inSplashScreen = segments[0] === "splash";
    const inThankYouScreen = segments[0] === "thank-you";
    const inPaywallScreen = segments[0] === "paywall";

    // First-time user flow: onboarding -> splash -> auth -> thank-you -> paywall -> app
    if (!hasSeenOnboarding && !inOnboardingGroup) {
      router.replace("/onboarding");
      return;
    }

    // After onboarding, go to splash screen
    if (hasSeenOnboarding && !isAuthenticated && !inSplashScreen && !inAuthGroup && !inThankYouScreen && !inPaywallScreen) {
      router.replace("/splash");
      return;
    }

    // After splash, go to registration (not login)
    if (!isAuthenticated && !inAuthGroup && !inSplashScreen && hasSeenOnboarding && !inThankYouScreen && !inPaywallScreen) {
      router.replace("/(auth)/register");
      return;
    }

    // After registration, go to thank you screen
    if (isAuthenticated && !hasSeenThankYou && !inThankYouScreen) {
      router.replace("/thank-you");
      return;
    }

    // After thank you, go to paywall
    if (isAuthenticated && hasSeenThankYou && !hasSeenPaywall && !inPaywallScreen) {
      router.replace("/paywall");
      return;
    }

    // If authenticated and has seen paywall, go to app
    if (isAuthenticated && hasSeenThankYou && hasSeenPaywall && (inAuthGroup || inSplashScreen || inThankYouScreen || inPaywallScreen)) {
      router.replace("/(tabs)");
      return;
    }
  }, [isAuthenticated, segments, isOnboardingComplete, hasSeenOnboarding, hasSeenThankYou, hasSeenPaywall, isMounted]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Retour",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="thank-you" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="scan" 
          options={{ 
            headerShown: false,
            presentation: 'fullScreenModal',
          }} 
        />
        <Stack.Screen 
          name="contact/[id]" 
          options={{ 
            title: "Détails du contact",
          }} 
        />
        <Stack.Screen 
          name="contact/edit" 
          options={{ 
            title: "Modifier le contact",
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="settings/subscription" 
          options={{ 
            title: "Abonnement",
          }} 
        />
        <Stack.Screen 
          name="settings/manage-subscription" 
          options={{ 
            title: "Gérer l'abonnement",
          }} 
        />
        <Stack.Screen 
          name="settings/export" 
          options={{ 
            title: "Exporter les contacts",
          }} 
        />
        <Stack.Screen 
          name="settings/notifications" 
          options={{ 
            title: "Notifications",
          }} 
        />
        <Stack.Screen 
          name="settings/help" 
          options={{ 
            title: "Aide & Support",
          }} 
        />
        <Stack.Screen 
          name="settings/contact-us" 
          options={{ 
            title: "Contactez-nous",
          }} 
        />
      </Stack>
    </>
  );
}