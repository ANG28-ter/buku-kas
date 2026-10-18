import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

type User = {
    id: string;
    email: string;
    name?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const userJson = await AsyncStorage.getItem("auth_user");
            if (userJson) {
                setUser(JSON.parse(userJson));
            }
        } catch (e) {
            console.error("Auth Load Error", e);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        setIsLoading(true);
        try {
            const { signInWithEmailAndPassword } = require("firebase/auth");
            const { auth } = require("../config/firebase");

            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Create session user
            const sessionUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email || email,
                name: firebaseUser.displayName || email.split("@")[0],
            };

            setUser(sessionUser);
            await AsyncStorage.setItem("auth_user", JSON.stringify(sessionUser));

            // Show success notification
            Alert.alert(
                "Login Berhasil!",
                `Selamat datang, ${sessionUser.name}!`,
                [{ text: "OK" }]
            );
        } catch (error: any) {
            let errorMessage = "Login gagal";

            // Firebase error codes
            if (error.code === "auth/user-not-found") {
                errorMessage = "Email tidak terdaftar";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Password salah";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Format email tidak valid";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Terlalu banyak percobaan. Coba lagi nanti";
            }

            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    async function register(email: string, password: string) {
        setIsLoading(true);

        try {
            const { createUserWithEmailAndPassword, updateProfile } = require("firebase/auth");
            const { auth } = require("../config/firebase");

            // Simple validation
            if (!email || !password) {
                throw new Error("Email dan password harus diisi");
            }
            if (password.length < 6) {
                throw new Error("Password minimal 6 karakter");
            }
            if (!email.includes("@")) {
                throw new Error("Format email tidak valid");
            }

            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update display name
            const displayName = email.split("@")[0];
            await updateProfile(firebaseUser, { displayName });

            // Create session user
            const sessionUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email || email,
                name: displayName,
            };

            setUser(sessionUser);
            await AsyncStorage.setItem("auth_user", JSON.stringify(sessionUser));

            // Show success notification
            Alert.alert(
                "Registrasi Berhasil!",
                `Akun ${email} berhasil dibuat!`,
                [{ text: "OK" }]
            );
        } catch (error: any) {
            let errorMessage = error.message || "Terjadi kesalahan saat mendaftar";

            // Firebase error codes
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Email sudah terdaftar";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Password terlalu lemah";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Format email tidak valid";
            }

            // Show error notification
            Alert.alert(
                "Registrasi Gagal",
                errorMessage,
                [{ text: "OK" }]
            );
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    async function logout() {
        try {
            const { signOut } = require("firebase/auth");
            const { auth } = require("../config/firebase");

            await signOut(auth);
            setUser(null);
            await AsyncStorage.removeItem("auth_user");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
