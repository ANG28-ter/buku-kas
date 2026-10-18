import { useState } from "react";
import { Alert, ScrollView, StatusBar, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { formatRupiah, parseRupiah } from "../utils/money";
import { createInitialPeriod } from "../services/periodService";
import { setInitialBalance } from "../repositories/settingsRepo";

export function OnboardingBalanceScreen({ navigation }: any) {
  const [amount, setAmount] = useState<number>(0);
  const { colors, mode } = useTheme();

  const handleSave = () => {
    try {
      // Set initial balance in settings
      setInitialBalance(amount);

      // Create initial period
      createInitialPeriod(amount);

      Alert.alert(
        "Success",
        `Your first period has been created with initial balance ${formatRupiah(amount)}`,
        [
          {
            text: "Continue",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Failed to create period");
    }
  };

  const quickAmounts = [0, 100_000, 500_000, 1_000_000, 5_000_000];

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1B2A" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={["#1B998B", "#06D6A0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: 60,
          paddingBottom: 40,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#FFFFFF",
            marginBottom: 8,
            letterSpacing: -0.5,
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#FFFFFF",
            opacity: 0.85,
            fontWeight: "400",
          }}
        >
          Let's start tracking your finances
        </Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingTop: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View
          style={{
            backgroundColor: "#1A2332",
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#1B998B",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  marginBottom: 2,
                }}
              >
                Initial Balance
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#8B95A5",
                  fontWeight: "400",
                }}
              >
                Set your starting amount
              </Text>
            </View>
          </View>

          {/* Amount Input */}
          <View
            style={{
              backgroundColor: "#0D1B2A",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              borderWidth: 2,
              borderColor: amount > 0 ? "#1B998B" : "#2A3544",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#8B95A5",
                marginBottom: 8,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Amount
            </Text>
            <TextInput
              value={amount === 0 ? "" : formatRupiah(amount)}
              onChangeText={(t) => setAmount(parseRupiah(t))}
              keyboardType="numeric"
              placeholder="Rp 0"
              placeholderTextColor="#4A5568"
              style={{
                fontSize: 36,
                fontWeight: "700",
                color: "#FFFFFF",
                padding: 0,
              }}
            />
          </View>

          {/* Quick Amount Buttons */}
          <Text
            style={{
              fontSize: 12,
              color: "#8B95A5",
              marginBottom: 12,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Quick Select
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setAmount(value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: amount === value ? "#1B998B" : "#2A3544",
                  borderWidth: 1,
                  borderColor: amount === value ? "#1B998B" : "#2A3544",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: amount === value ? "#FFFFFF" : "#8B95A5",
                  }}
                >
                  {value === 0 ? "Rp 0" : formatRupiah(value)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: "#1A2332",
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderLeftWidth: 4,
            borderLeftColor: "#1B998B",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle-outline" size={20} color="#1B998B" style={{ marginRight: 8, marginTop: 2 }} />
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: "#B0B8C4",
                lineHeight: 20,
              }}
            >
              You can change this balance later or create new periods monthly to reset your tracking.
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: "#1B998B",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            shadowColor: "#1B998B",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            Start Tracking
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
