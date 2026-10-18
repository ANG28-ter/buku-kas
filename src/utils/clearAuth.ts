// Temporary script to clear AsyncStorage
// Run this in your app once to reset auth state

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function clearAuthData() {
    try {
        await AsyncStorage.removeItem("auth_user");
        console.log("✅ Auth data cleared! Please restart the app.");
    } catch (e) {
        console.error("❌ Failed to clear auth data:", e);
    }
}

// To use: Import this in App.tsx and call clearAuthData() once
