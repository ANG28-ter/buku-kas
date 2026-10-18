import "react-native-get-random-values";
import "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { runMigrations } from "./src/db/migrations";
import { getSettings } from "./src/repositories/settingsRepo";
import { AppNavigator } from "./src/navigation";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<"Login" | "Onboarding" | "MainTabs">(
    "Login"
  );

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      runMigrations();
      
      const userJson = await AsyncStorage.getItem("auth_user");
      const isAuthenticated = !!userJson;

      console.log("=== AUTH CHECK ===");
      console.log("User data from storage:", userJson);
      console.log("Is authenticated:", isAuthenticated);

      if (!isAuthenticated) {
        // Not logged in -> go to Login
        console.log("Routing to: Login");
        setInitialRoute("Login");
      } else {
        // Logged in -> check onboarding status
        const s = getSettings();
        console.log("Onboarding status:", s.onboarding_done);
        const route = s.onboarding_done === 1 ? "MainTabs" : "Onboarding";
        console.log("Routing to:", route);
        setInitialRoute(route);
      }

      setReady(true);
    } catch (e) {
      console.error("INIT ERROR:", e);
      setReady(true);
    }
  }

  if (!ready) return <Text>Loading...</Text>;

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator initialRouteName={initialRoute} />
      </AuthProvider>
    </ThemeProvider>
  );
}
