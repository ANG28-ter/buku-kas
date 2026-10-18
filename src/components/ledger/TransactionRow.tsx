import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Transaction } from "../../models/domain";

function rp(n: number) {
    return `Rp ${n.toLocaleString("id-ID")}`;
}

export function TransactionRow({ tx, onPress }: { tx: Transaction; onPress: () => void }) {
    const isIncome = tx.type === "income";

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                marginHorizontal: 24,
                marginBottom: 6, // Reduced from 8
                backgroundColor: "#1A2332",
                borderRadius: 12,
                paddingVertical: 10, // Reduced from 14
                paddingHorizontal: 12, // Reduced from 14
            }}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                        style={{
                            width: 32, // Reduced from 36
                            height: 32, // Reduced from 36
                            borderRadius: 8,
                            backgroundColor: isIncome ? "rgba(27, 153, 139, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons
                            name={isIncome ? "arrow-down" : "arrow-up"}
                            size={16} // Reduced from 18
                            color={isIncome ? "#1B998B" : "#EF4444"}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontWeight: "600",
                                fontSize: 14, // Reduced from 15
                                color: "#FFFFFF",
                                marginBottom: 0, // Reduced from 2
                            }}
                            numberOfLines={1}
                        >
                            {tx.note || (isIncome ? "Income" : "Expense")}
                        </Text>
                        <Text style={{ color: "#8B95A5", fontSize: 11 }}>
                            {new Date(tx.occurred_at).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text
                        style={{
                            fontWeight: "700",
                            fontSize: 14, // Reduced from 15
                            color: isIncome ? "#1B998B" : "#EF4444",
                        }}
                    >
                        {isIncome ? "+" : "-"} {rp(tx.amount)}
                    </Text>
                    <Text style={{ color: "#8B95A5", fontSize: 10, marginTop: 1 }}>
                        {rp(tx.balance_after)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
