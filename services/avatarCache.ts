import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";

const AVATAR_DIR = `${FileSystem.documentDirectory}avatars/`;

/**
 * Avatar Cache Service
 * Handles local-first avatar loading with AsyncStorage and FileSystem
 */

// Ensure avatar directory exists
async function ensureAvatarDir() {
  const dirInfo = await FileSystem.getInfoAsync(AVATAR_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AVATAR_DIR, { intermediates: true });
  }
}

/**
 * Get local avatar path from AsyncStorage cache
 */
export async function getLocalAvatarPath(
  userId: string,
): Promise<string | null> {
  const key = `avatar_local_path_${userId}`;
  return await AsyncStorage.getItem(key);
}

/**
 * Get last sync timestamp from AsyncStorage cache
 */
export async function getLastSyncedAt(userId: string): Promise<string | null> {
  const key = `avatar_synced_at_${userId}`;
  return await AsyncStorage.getItem(key);
}

/**
 * Save local avatar metadata to AsyncStorage
 */
/**
 * Save local avatar metadata to AsyncStorage
 */
export async function saveAvatarMetadata(
  userId: string,
  localPath: string,
  syncedAt: string,
) {
  await AsyncStorage.setItem(`avatar_local_path_${userId}`, localPath);
  await AsyncStorage.setItem(`avatar_synced_at_${userId}`, syncedAt);
}

/**
 * Download avatar from Supabase Storage URL to local filesystem
 */
async function downloadAvatar(
  avatarUrl: string,
  userId: string,
): Promise<string> {
  await ensureAvatarDir();

  // Use unique filename from URL to prevent overwriting
  const filename = avatarUrl.split("/").pop() || `${userId}_${Date.now()}.jpg`;
  const localPath = `${AVATAR_DIR}${filename}`;

  // Download file from Supabase Storage
  const downloadResult = await FileSystem.downloadAsync(avatarUrl, localPath);

  if (downloadResult.status !== 200) {
    throw new Error("Failed to download avatar");
  }

  return localPath;
}

/**
 * Get avatar - returns local path if exists, null otherwise
 */
export async function getLocalAvatar(userId: string): Promise<string | null> {
  const localPath = await getLocalAvatarPath(userId);

  if (!localPath) {
    return null;
  }

  // Check if file still exists
  const fileInfo = await FileSystem.getInfoAsync(localPath);
  if (!fileInfo.exists) {
    // Clean up stale AsyncStorage entry
    await AsyncStorage.removeItem(`avatar_local_path_${userId}`);
    await AsyncStorage.removeItem(`avatar_synced_at_${userId}`);
    return null;
  }

  return localPath;
}

/**
 * Sync avatar from Supabase - downloads if remote is newer or no local exists
 * Returns updated local path or null
 */
export async function syncAvatar(userId: string): Promise<string | null> {
  try {
    // Fetch profile from Supabase
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("avatar_url, updated_at")
      .eq("id", userId)
      .single();

    if (error || !profile?.avatar_url) {
      return null;
    }

    const remoteUpdatedAt = profile.updated_at;
    const localSyncedAt = await getLastSyncedAt(userId);

    // Check if we need to download
    const needsDownload =
      !localSyncedAt || // No local cache
      !remoteUpdatedAt || // No remote timestamp (download to be safe)
      new Date(remoteUpdatedAt) > new Date(localSyncedAt); // Remote is newer

    if (needsDownload) {
      // Download avatar to local filesystem
      const localPath = await downloadAvatar(profile.avatar_url, userId);

      // Save metadata to AsyncStorage
      await saveAvatarMetadata(
        userId,
        localPath,
        remoteUpdatedAt || new Date().toISOString(),
      );

      return localPath;
    }

    // Return existing local path
    return await getLocalAvatarPath(userId);
  } catch (error) {
    console.error("Avatar sync failed:", error);
    // Return local avatar if sync fails (offline support)
    return await getLocalAvatarPath(userId);
  }
}

/**
 * Force refresh avatar - always downloads from Supabase
 */
export async function forceRefreshAvatar(
  userId: string,
): Promise<string | null> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("avatar_url, updated_at")
      .eq("id", userId)
      .single();

    if (error || !profile?.avatar_url) {
      throw new Error("No avatar found in Supabase");
    }

    // Download avatar
    const localPath = await downloadAvatar(profile.avatar_url, userId);

    // Save metadata
    await saveAvatarMetadata(
      userId,
      localPath,
      profile.updated_at || new Date().toISOString(),
    );

    return localPath;
  } catch (error) {
    console.error("Force refresh failed:", error);
    throw error;
  }
}

/**
 * Cache avatar after upload - saves the newly uploaded avatar to local cache
 */
export async function cacheUploadedAvatar(
  userId: string,
  avatarUrl: string,
  saveMetadata: boolean = true,
): Promise<string> {
  const localPath = await downloadAvatar(avatarUrl, userId);

  if (saveMetadata) {
    await saveAvatarMetadata(userId, localPath, new Date().toISOString());
  }

  return localPath;
}
