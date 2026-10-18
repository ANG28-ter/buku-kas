import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { RecapScreen } from "../screens/RecapScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
    const { colors, mode } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0D1B2A", // Seamless with screen background
                    borderTopColor: "#2A3544",
                    borderTopWidth: 1,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 64,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: "#1B998B",
                tabBarInactiveTintColor: "#8B95A5",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Recap") {
                        iconName = focused ? "pie-chart" : "pie-chart-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen as any}
                options={{ title: "Beranda" }}
            />
            <Tab.Screen
                name="Recap"
                component={RecapScreen}
                options={{ title: "Rekap" }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Pengaturan" }}
            />
        </Tab.Navigator>
    );
}
