import React from "react";
import { Tabs } from "expo-router";
import { ScanLine, Users, User } from "lucide-react-native";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <ScanLine size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}