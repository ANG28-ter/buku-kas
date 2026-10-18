import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Mohon isi semua form");
            return;
        }
        try {
            await login(email, password);

            const { syncFromCloud } = require("../services/firestoreSync");
            const { getSettings } = require("../repositories/settingsRepo");
            const AsyncStorage = require("@react-native-async-storage/async-storage").default;

            const userJson = await AsyncStorage.getItem("auth_user");
            if (userJson) {
                const user = JSON.parse(userJson);
                try {
                    await syncFromCloud(user.id);
                } catch (syncError) {
                    console.warn("Sync error:", syncError);
                }
            }

            const settings = getSettings();
            if (settings.onboarding_done === 1) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "MainTabs" }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Onboarding" }],
                });
            }
        } catch (e: any) {
            Alert.alert("Login Gagal", e.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />
            <LinearGradient
                colors={["#0D1B2A", "#1A2332"]}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="wallet" size={40} color="#1B998B" />
                        </View>
                        <Text style={styles.title}>BukuKas</Text>
                        <Text style={styles.subtitle}>
                            Kelola keuangan Anda dengan bijak
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#8B95A5" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#4A5568"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#8B95A5" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#4A5568"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Masuk</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Belum punya akun?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={styles.link}>Daftar Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D1B2A",
    },
    gradient: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    header: {
        marginBottom: 40,
        alignItems: "center",
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: "rgba(27, 153, 139, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: "#8B95A5",
        textAlign: "center",
    },
    form: {
        backgroundColor: "#1A2332",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#2A3544",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: "#0D1B2A",
        borderWidth: 1,
        borderColor: "#2A3544",
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: "100%",
        color: "#FFFFFF",
    },
    button: {
        borderRadius: 16,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 24,
        backgroundColor: "#1B998B",
        shadowColor: "#1B998B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        fontSize: 14,
        color: "#8B95A5",
    },
    link: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1B998B",
    },
});
