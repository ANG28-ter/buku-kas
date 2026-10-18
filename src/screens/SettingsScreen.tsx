import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export const SettingsScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation<any>();

    return (
        <View style={{ flex: 1, backgroundColor: "#0D1B2A" }}>
            {/* Header */}
            <LinearGradient
                colors={["#1B998B", "#06D6A0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Settings</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    {user ? (
                        <View style={styles.card}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{user.email[0].toUpperCase()}</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>{user.name || "User"}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.card, styles.loginCard]}
                            onPress={() => navigation.navigate("Login")}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="person-circle-outline" size={24} color="#1B998B" style={{ marginRight: 12 }} />
                                <Text style={styles.loginText}>Login / Register</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#8B95A5" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Ionicons name="information-circle-outline" size={20} color="#1B998B" />
                            <Text style={styles.infoText}>Buku Kas v1.0.0</Text>
                        </View>
                        <View style={[styles.infoRow, { marginTop: 12 }]}>
                            <Ionicons name="code-slash-outline" size={20} color="#1B998B" />
                            <Text style={styles.infoText}>Built with React Native & Firebase</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
        color: "#8B95A5",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontWeight: "600",
    },
    card: {
        borderRadius: 16,
        padding: 20,
        backgroundColor: "#1A2332",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2A3544",
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#1B998B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: "#8B95A5",
    },
    logoutButton: {
        paddingVertical: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    logoutText: {
        fontWeight: "700",
        color: "#EF4444",
        fontSize: 15,
    },
    loginCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
    },
    loginText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoText: {
        fontSize: 14,
        color: "#FFFFFF",
    },
});
