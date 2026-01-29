import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Text className="text-white text-2xl font-bold flex-1">About</Text>
        </View>

        {/* Content */}
        <View className="items-center py-8">
          {/* Logo */}
          <View className="w-32 h-32 rounded-3xl bg-brand-blue items-center justify-center mb-6">
            <Image
              source={require("../assets/logo.png")}
              className="w-24 h-24"
              resizeMode="contain"
              style={{ tintColor: "white" }}
            />
          </View>

          {/* App Name */}
          <Text className="text-white text-3xl font-bold mb-2">PROscore</Text>
          <Text className="text-gray-400 text-sm mb-8">
            Professional Scorekeeping
          </Text>

          {/* Description */}
          <Text className="text-gray-300 text-base text-center mb-8 px-4 leading-6">
            PROscore is your ultimate scorekeeping companion for professional
            sports and events. Track scores, manage teams, and deliver real-time
            updates with precision and style.
          </Text>

          {/* Version */}
          <View className="bg-dark-card rounded-2xl px-6 py-4 border border-dark-border">
            <Text className="text-gray-400 text-sm text-center">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
