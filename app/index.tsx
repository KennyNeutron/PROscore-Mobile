import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../services/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/home");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/home");
      }
    });
  }, []);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Login Failed", error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <View className="flex-1 justify-center items-center px-8 py-12">
            {/* Logo */}
            <View className="items-center mb-12">
              <Image
                source={require("../assets/logo.png")}
                className="w-32 h-32 mb-6 rounded-3xl"
                resizeMode="cover"
              />
              <Text className="text-white text-4xl font-black tracking-tight">
                PROscore
              </Text>
              <Text className="text-gray-400 text-lg font-medium mt-2 tracking-wide">
                Professional Scorekeeping
              </Text>
            </View>

            {/* Login Form */}
            <View className="w-full max-w-md">
              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  EMAIL
                </Text>
                <TextInput
                  className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#666666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  PASSWORD
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 pr-14 text-white text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#666666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={22}
                      color="#666666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                className="mb-4 rounded-2xl overflow-hidden shadow-lg shadow-brand-blue/50"
                disabled={loading}
              >
                <View className="bg-brand-blue py-5 items-center rounded-2xl">
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-lg font-bold tracking-wide">
                      LOGIN
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Create Account & Forgot Password Row */}
              <View className="flex-row justify-between items-center mt-2">
                <TouchableOpacity
                  className="py-3"
                  onPress={() => router.push("/register")}
                >
                  <Text className="text-brand-blue text-sm font-semibold">
                    Create Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="py-3">
                  <Text className="text-brand-blue text-sm font-semibold">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
