import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile and Greeting */}
        <View className="flex-row items-center mb-10">
          <View className="mr-4">
            <View className="w-16 h-16 rounded-full border-2 border-brand-blue/30 overflow-hidden shadow-lg shadow-brand-blue/20">
              <Image
                source={{
                  uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg",
                }}
                className="w-full h-full"
              />
            </View>
          </View>
          <View>
            <Text className="text-white text-lg font-bold tracking-tight">
              Good evening, Kenny
            </Text>
          </View>
        </View>

        {/* Model Selection Label */}
        <View className="mb-8">
          <Text className="text-gray-500 text-sm font-bold tracking-widest uppercase ml-1">
            Select scoreboard model
          </Text>
        </View>

        {/* Scoreboard Model Cards */}
        <View>
          <ModelCard
            title="PROscore Nano"
            description="Compact. Powerful. Portable."
            iconName="cube"
            onPress={() => console.log("Nano selected")}
          />
          <View className="h-6" />
          <ModelCard
            title="PROscore Junior"
            description="Versatile. Durable. Professional."
            iconName="flash"
            onPress={() => console.log("Junior selected")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ModelCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function ModelCard({ title, description, iconName, onPress }: ModelCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="rounded-3xl overflow-hidden"
    >
      <LinearGradient
        colors={["#0056B888", "#0056B811", "#0056B822"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="p-[1.5px]"
        style={{ borderRadius: 24 }}
      >
        <LinearGradient
          colors={["#1A1A1A", "#121212"]}
          className="px-4 py-3 flex-row items-center border border-white/5 h-[96px] rounded-3xl overflow-hidden"
          style={{ borderRadius: 22.5 }}
        >
          {/* Card Icon Container - Fixed Size with No Shrink */}
          <View className="bg-brand-blue w-14 h-14 rounded-2xl items-center justify-center shrink-0">
            <Ionicons name={iconName} size={32} color="white" />
          </View>

          {/* Card Text Content - Centered Vertically */}
          <View className="flex-1 ml-4 justify-center">
            <Text className="text-white text-xl font-bold tracking-tight">
              {title}
            </Text>
            <Text className="text-gray-500 text-sm font-medium tracking-wide mt-0.5">
              {description}
            </Text>
          </View>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
}
