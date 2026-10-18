import React from "react";
import { View, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PremiumButton } from "../components/common/PremiumButton";
import { useTheme } from "../contexts/ThemeContext";
import { Card } from "../components/common/Card";

export function DebugScreen({ navigation }: any) {
    const { colors } = useTheme();

    const clearAllData = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert(
                "Data Cleared",
                "All app data has been cleared. Please restart the app.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // Force reload
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            });
                        },
                    },
                ]
            );
        } catch (e) {
            Alert.alert("Error", "Failed to clear data");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
            <Card padding="lg">
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 12 }}>
                    Debug Tools
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>
                    Use this to reset the app to initial state
                </Text>
                <PremiumButton
                    title="Clear All Data & Reset to Login"
                    onPress={clearAllData}
                    variant="danger"
                    size="lg"
                    fullWidth
                />
            </Card>
        </View>
    );
}
