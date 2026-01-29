import React from "react";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScoreboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 items-center justify-center space-y-12">
        {/* Game Timer */}
        <View className="items-center">
          <Text className="text-gray-400 text-xl font-medium tracking-widest mb-1">
            GAME TIMER
          </Text>
          <Text className="text-white text-9xl font-bold tracking-tighter">
            10:00.0
          </Text>
        </View>

        {/* Score Row */}
        <View className="flex-row justify-between w-full px-12">
          <View className="items-center">
            <Text className="text-blue-400 text-2xl font-bold mb-2">HOME</Text>
            <Text className="text-white text-8xl font-black">0</Text>
          </View>
          <View className="items-center">
            <Text className="text-red-400 text-2xl font-bold mb-2">AWAY</Text>
            <Text className="text-white text-8xl font-black">0</Text>
          </View>
        </View>

        {/* Shot Clock */}
        <View className="items-center bg-zinc-900 px-10 py-4 rounded-3xl border border-zinc-800">
          <Text className="text-orange-500 text-xl font-bold tracking-widest mb-1">
            SHOT CLOCK
          </Text>
          <Text className="text-orange-500 text-7xl font-bold tabular-nums">
            24.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
