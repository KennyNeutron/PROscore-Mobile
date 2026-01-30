import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Sign up the user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        },
      );

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("User creation failed");
      }

      // Note: Profile is automatically created by the handle_new_user trigger
      // We need to update it with additional fields (phone_number, address, password)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          phone_number: phoneNumber || null,
          address: address || null,
          password: password,
        })
        .eq("id", authData.user.id);

      if (updateError) {
        console.warn("Profile update failed:", updateError);
        // Don't throw error - profile creation succeeded, only additional fields failed
      }

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
          <View className="flex-1 px-8 py-12">
            {/* Header */}
            <View className="mb-8">
              <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <Text className="text-brand-blue text-base font-semibold">
                  ← Back to Login
                </Text>
              </TouchableOpacity>

              <Text className="text-white text-3xl font-black tracking-tight">
                Create Account
              </Text>
              <Text className="text-gray-400 text-base font-medium mt-2">
                Join PROscore today
              </Text>
            </View>

            {/* Registration Form */}
            <View className="w-full">
              {/* Full Name Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  FULL NAME
                </Text>
                <TextInput
                  className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor="#666666"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

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

              {/* Phone Number Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  PHONE NUMBER
                </Text>
                <TextInput
                  className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#666666"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Address Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  ADDRESS
                </Text>
                <TextInput
                  className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base"
                  placeholder="Enter your address"
                  placeholderTextColor="#666666"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>

              {/* Password Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  PASSWORD
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 pr-14 text-white text-base"
                    placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  CONFIRM PASSWORD
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 pr-14 text-white text-base"
                    placeholder="Re-enter your password"
                    placeholderTextColor="#666666"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={22}
                      color="#666666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                activeOpacity={0.8}
                className="mb-4 rounded-2xl overflow-hidden shadow-lg shadow-brand-blue/50"
                disabled={loading}
              >
                <View className="bg-brand-blue py-5 items-center rounded-2xl">
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-lg font-bold tracking-wide">
                      CREATE ACCOUNT
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Terms */}
              <Text className="text-gray-500 text-xs text-center leading-5 px-4">
                By creating an account, you agree to our{" "}
                <Text className="text-brand-blue">Terms of Service</Text> and{" "}
                <Text className="text-brand-blue">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
