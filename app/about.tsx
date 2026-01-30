import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Text className="text-white text-2xl font-bold flex-1">About</Text>
        </View>

        {/* Content */}
        <View className="items-center py-4">
          {/* Logo */}
          <View className="w-32 h-32 rounded-3xl bg-dark-card items-center justify-center mb-6 border border-dark-border shadow-lg shadow-black/50">
            <Image
              source={require("../assets/logo.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Text className="text-white text-3xl font-bold mb-2 tracking-tight">
            PROscore
          </Text>
          <Text className="text-gray-400 text-sm mb-8 font-medium tracking-wide">
            PROFESSIONAL SCOREKEEPING
          </Text>

          {/* Description */}
          <Text className="text-gray-300 text-base text-center mb-8 px-2 leading-7">
            PROscore is your ultimate scorekeeping companion for professional
            sports and events. Track scores, manage teams, and deliver real-time
            updates with precision and style.
          </Text>

          {/* Key Features */}
          <View className="w-full bg-dark-card rounded-2xl p-6 mb-8 border border-dark-border">
            <Text className="text-white text-lg font-bold mb-4">
              Key Features
            </Text>
            <View className="space-y-3">
              <FeatureItem icon="time-outline" text="Real-time Scorekeeping" />
              <FeatureItem
                icon="people-outline"
                text="Team & Player Management"
              />
              <FeatureItem
                icon="cloud-offline-outline"
                text="Offline Support"
              />
              <FeatureItem icon="moon-outline" text="Dark Mode Optimized" />
            </View>
          </View>

          {/* Version */}
          <View className="items-center mb-8">
            <Text className="text-gray-500 text-xs uppercase tracking-widest mb-1">
              Version
            </Text>
            <View className="bg-dark-card rounded-full px-4 py-1 border border-dark-border">
              <Text className="text-gray-300 text-sm font-mono">
                v{version}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-gray-600 text-xs text-center">
            © 2024 PROscore Team. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View className="flex-row items-center">
      <Ionicons name={icon} size={20} color="#4A90E2" />
      <Text className="text-gray-300 text-sm ml-3 font-medium">{text}</Text>
    </View>
  );
}
