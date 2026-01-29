import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Text className="text-white text-2xl font-bold flex-1">Profile</Text>
        </View>

        {/* Placeholder Content */}
        <View className="items-center justify-center py-20">
          <Ionicons name="person-circle-outline" size={80} color="#666666" />
          <Text className="text-gray-400 text-base mt-4">
            Profile screen coming soon
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
