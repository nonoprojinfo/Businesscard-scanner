import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  initialRouteName: "splash",
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
  const { isAuthenticated, isOnboardingComplete, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status when app loads
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "onboarding";

    if (
      // If the user is not signed in and the initial segment is not in the auth group,
      // redirect to the sign-in screen.
      !isAuthenticated &&
      !inAuthGroup &&
      !inOnboardingGroup &&
      segments[0] !== "splash"
    ) {
      router.replace("/(auth)/login");
    } else if (
      // If the user is signed in and the initial segment is in the auth group,
      // redirect away.
      isAuthenticated &&
      (inAuthGroup || segments[0] === "splash")
    ) {
      // If onboarding is not complete, redirect to onboarding
      if (!isOnboardingComplete) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, segments, isOnboardingComplete]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
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
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
            title: "Contact Details",
          }} 
        />
        <Stack.Screen 
          name="contact/edit" 
          options={{ 
            title: "Edit Contact",
            presentation: 'modal',
          }} 
        />
      </Stack>
    </>
  );
}