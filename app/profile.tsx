import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import * as avatarCache from "../services/avatarCache";
import { supabase } from "../services/supabase";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLocalPath, setAvatarLocalPath] = useState<string | null>(null);

  useEffect(() => {
    loadAvatar();
    fetchProfile();
  }, []);

  const loadAvatar = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Load local avatar immediately (instant load)
      const localPath = await avatarCache.getLocalAvatar(user.id);
      if (localPath) {
        setAvatarLocalPath(localPath);
      }

      // Sync avatar in background
      setSyncing(true);
      const syncedPath = await avatarCache.syncAvatar(user.id);
      if (syncedPath && syncedPath !== localPath) {
        setAvatarLocalPath(syncedPath);
      }
    } catch (error) {
      console.error("Avatar load failed:", error);
    } finally {
      setSyncing(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
        setPhoneNumber(profile.phone_number || "");
        setAddress(profile.address || "");
        setAvatarUrl(profile.avatar_url || "");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phoneNumber || null,
          address: address || null,
          avatar_url: avatarUrl || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "You need to allow access to your photos to change your avatar.",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        // Show loading state
        setSaving(true);

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("No user found");

          // Get file extension
          const ext = imageUri.split(".").pop() || "jpg";
          const fileName = `${user.id}_${Date.now()}.${ext}`;

          // Fetch the image and convert to blob
          const response = await fetch(imageUri);
          const blob = await response.blob();

          // Convert blob to ArrayBuffer for upload
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as ArrayBuffer);
              reader.onerror = reject;
              reader.readAsArrayBuffer(blob);
            },
          );

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("avatars")
              .upload(fileName, arrayBuffer, {
                contentType: `image/${ext}`,
                upsert: false,
              });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

          // Update avatar URL state
          setAvatarUrl(urlData.publicUrl);

          // Cache avatar locally for offline access
          const localPath = await avatarCache.cacheUploadedAvatar(
            user.id,
            urlData.publicUrl,
            false, // Don't commit to persistent cache until profile is saved
          );
          setAvatarLocalPath(localPath);

          Alert.alert("Success", "Avatar uploaded successfully!");
        } catch (uploadError: any) {
          Alert.alert(
            "Upload Failed",
            uploadError.message || "Failed to upload avatar",
          );
          console.error("Upload error:", uploadError);
        } finally {
          setSaving(false);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to pick image: " + error.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
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
          <View className="flex-1 px-6 py-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-black tracking-tight">
                Profile
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {saving ? (
                  <ActivityIndicator color="#4A90E2" />
                ) : (
                  <Text className="text-brand-blue text-base font-semibold">
                    {isEditing ? "Save" : "Edit"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View className="items-center mb-8">
              <View className="w-32 h-32 rounded-full border-4 border-brand-blue overflow-hidden shadow-lg shadow-brand-blue/20 items-center justify-center bg-dark-card">
                {avatarLocalPath || avatarUrl ? (
                  <Image
                    source={{ uri: avatarLocalPath || avatarUrl }}
                    className="w-full h-full"
                  />
                ) : (
                  <Ionicons name="person" size={64} color="#4A90E2" />
                )}
              </View>
              {isEditing && (
                <TouchableOpacity
                  onPress={pickImage}
                  disabled={saving}
                  className="mt-4 mb-2"
                >
                  {saving ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#4A90E2" />
                      <Text className="text-brand-blue text-sm font-semibold ml-2">
                        Uploading...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-brand-blue text-sm font-semibold">
                      Change Avatar
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Profile Form */}
            <View className="w-full">
              {/* Full Name */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  FULL NAME
                </Text>
                <TextInput
                  className={`bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base ${
                    !isEditing ? "opacity-60" : ""
                  }`}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666666"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={isEditing}
                  autoCapitalize="words"
                />
              </View>

              {/* Email */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  EMAIL
                </Text>
                <TextInput
                  className="bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base opacity-60"
                  placeholder="Enter your email"
                  placeholderTextColor="#666666"
                  value={email}
                  editable={false}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text className="text-gray-500 text-xs mt-1 ml-1">
                  Email cannot be changed
                </Text>
              </View>

              {/* Phone Number */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  PHONE NUMBER
                </Text>
                <TextInput
                  className={`bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base ${
                    !isEditing ? "opacity-60" : ""
                  }`}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#666666"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  editable={isEditing}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Address */}
              <View className="mb-5">
                <Text className="text-white text-sm font-semibold mb-2 ml-1">
                  ADDRESS
                </Text>
                <TextInput
                  className={`bg-dark-card border border-dark-border rounded-2xl px-6 py-4 text-white text-base ${
                    !isEditing ? "opacity-60" : ""
                  }`}
                  placeholder="Enter your address"
                  placeholderTextColor="#666666"
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>

              {/* Cancel Button (only show when editing) */}
              {isEditing && (
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset to original values
                  }}
                  className="mt-2 rounded-2xl border border-dark-border py-4"
                >
                  <Text className="text-gray-400 text-center text-base font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
