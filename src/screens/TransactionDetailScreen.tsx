import { Text, TouchableOpacity, View } from "react-native";
import { db } from "../db";
import { listActiveCategories } from "../repositories/categoryRepo";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

function rp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function TransactionDetailScreen({ route, navigation }: any) {
  const { id } = route.params;

  const tx = db.getFirstSync(
    `SELECT * FROM transactions WHERE id = '${id}' LIMIT 1;`
  ) as any;

  const categories = useMemo(() => listActiveCategories(), []);
  const category = categories.find((c) => c.id === tx?.category_id);

  if (!tx) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: "#0D1B2A",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="alert-circle-outline" size={64} color="#4A5568" />
        <Text style={{ color: "#FFFFFF", marginTop: 16, fontSize: 16 }}>
          Transaction not found
        </Text>
      </View>
    );
  }

  const isIncome = tx.type === "income";

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1B2A" }}>
      {/* Hero Section with Gradient */}
      <LinearGradient
        colors={isIncome ? ["#1B998B", "#06D6A0"] : ["#EF4444", "#DC2626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: 60,
          paddingBottom: 40,
          paddingHorizontal: 24,
          alignItems: "center",
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 60,
            left: 24,
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Ionicons
          name={isIncome ? "arrow-down-circle" : "arrow-up-circle"}
          size={64}
          color="#FFFFFF"
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#FFFFFF",
            marginTop: 12,
            opacity: 0.9,
          }}
        >
          {tx.type === "expense" ? "Expense" : "Income"}
        </Text>
        <Text
          style={{
            fontSize: 42,
            fontWeight: "900",
            color: "#FFFFFF",
            marginTop: 8,
          }}
        >
          {tx.type === "expense" ? "-" : "+"} {rp(tx.amount)}
        </Text>
      </LinearGradient>

      {/* Details */}
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        {/* Category Card */}
        {category && (
          <View
            style={{
              backgroundColor: "#1A2332",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#8B95A5",
                marginBottom: 12,
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              Category
            </Text>
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: "#0D1B2A",
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                {category.icon ? `${category.icon} ` : ""}
                {category.name}
              </Text>
            </View>
          </View>
        )}

        {/* Time Card */}
        <View
          style={{
            backgroundColor: "#1A2332",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="calendar-outline" size={20} color="#1B998B" />
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#8B95A5",
                  marginBottom: 4,
                }}
              >
                Transaction Time
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                {new Date(tx.occurred_at).toLocaleString("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Balance Cards */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#1A2332",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#8B95A5",
                marginBottom: 8,
              }}
            >
              Balance Before
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFFFFF" }}>
              {rp(tx.balance_before)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#1A2332",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#8B95A5",
                marginBottom: 8,
              }}
            >
              Balance After
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFFFFF" }}>
              {rp(tx.balance_after)}
            </Text>
          </View>
        </View>

        {/* Note Card */}
        {tx.note && (
          <View
            style={{
              backgroundColor: "#1A2332",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#8B95A5",
                marginBottom: 12,
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              Note
            </Text>
            <Text style={{ fontSize: 16, color: "#FFFFFF", lineHeight: 24 }}>
              {tx.note}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ marginTop: "auto", gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditTransaction", { id })}
            style={{
              backgroundColor: "#1B998B",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: "#1B998B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              Edit Transaction
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: "#0D1B2A",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#2A3544",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#8B95A5",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
