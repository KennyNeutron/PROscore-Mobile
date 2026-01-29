import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile and Greeting */}
        <View className="flex-row items-center mb-10">
          <TouchableOpacity
            className="mr-4"
            onPress={() => setMenuVisible(true)}
          >
            <View className="w-16 h-16 rounded-full border-2 border-brand-blue/30 overflow-hidden shadow-lg shadow-brand-blue/20">
              <Image
                source={{
                  uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg",
                }}
                className="w-full h-full"
              />
            </View>
          </TouchableOpacity>
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

      {/* Avatar Menu Modal */}
      <AvatarMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(screen) => {
          setMenuVisible(false);
          if (screen === "logout") {
            // storage.clearAll();
            console.log("Session cleared");
            router.replace("/");
          } else {
            router.push(screen as any);
          }
        }}
      />
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

// Avatar Menu Component
interface AvatarMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

function AvatarMenu({ visible, onClose, onNavigate }: AvatarMenuProps) {
  const menuItems = [
    { id: "profile", label: "Profile", icon: "person-outline" },
    { id: "settings", label: "Settings", icon: "settings-outline" },
    { id: "about", label: "About", icon: "information-circle-outline" },
    { id: "logout", label: "Logout", icon: "log-out-outline" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <View className="bg-dark-card rounded-t-3xl px-4 py-6">
          {/* Handle Bar */}
          <View className="w-12 h-1 bg-gray-600 rounded-full self-center mb-6" />

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <Pressable
                className="flex-row items-center px-4 py-4 active:bg-dark-border rounded-2xl"
                onPress={() => onNavigate(item.id)}
              >
                <View className="w-10 h-10 items-center justify-center mr-4">
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.id === "logout" ? "#EF4444" : "#0056B8"}
                  />
                </View>
                <Text
                  className={`text-lg font-semibold ${
                    item.id === "logout" ? "text-red-500" : "text-white"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
              {index < menuItems.length - 1 && (
                <View className="h-px bg-dark-border mx-4 my-2" />
              )}
            </React.Fragment>
          ))}

          {/* Cancel Button */}
          <Pressable
            className="mt-4 bg-dark-border rounded-2xl px-4 py-4 items-center active:opacity-70"
            onPress={onClose}
          >
            <Text className="text-white text-lg font-semibold">Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
