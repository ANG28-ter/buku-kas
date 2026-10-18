import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getPeriodSummary } from "../services/periodService";
import { getActivePeriod } from "../repositories/periodRepo";
import { formatRupiah } from "../utils/money";
import { Ionicons } from "@expo/vector-icons";

export const RecapScreen = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        periodName: string;
        totalIncome: number;
        totalExpense: number;
        net: number;
        insight: string;
        insightColor: string;
        ratio: number;
    } | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = () => {
        setLoading(true);
        try {
            const period = getActivePeriod();
            if (period) {
                const summary = getPeriodSummary(period.id);
                const { totalIncome, totalExpense, net } = summary;

                let insight = "No data";
                let insightColor = "#8B95A5";
                let ratio = 0;

                if (totalIncome > 0) {
                    ratio = totalExpense / totalIncome;
                    if (ratio > 1) {
                        insight = "Overspending";
                        insightColor = "#EF4444";
                    } else if (ratio > 0.8) {
                        insight = "High Spending";
                        insightColor = "#F59E0B";
                    } else if (ratio > 0.5) {
                        insight = "Balanced";
                        insightColor = "#3B82F6";
                    } else {
                        insight = "Great Savings";
                        insightColor = "#1B998B";
                    }
                } else if (totalExpense > 0) {
                    insight = "Expense Only";
                    insightColor = "#EF4444";
                    ratio = 1;
                }

                setData({
                    periodName: period.name,
                    totalIncome,
                    totalExpense,
                    net,
                    insight,
                    insightColor,
                    ratio: Math.min(ratio, 1),
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: "#0D1B2A" }]}>
                <ActivityIndicator size="large" color="#1B998B" />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={[styles.center, { backgroundColor: "#0D1B2A" }]}>
                <Text style={{ color: "#FFFFFF" }}>No active period found.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#0D1B2A" }}>
            {/* Header */}
            <LinearGradient
                colors={["#1B998B", "#06D6A0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Monthly Recap</Text>
                <Text style={styles.headerSubtitle}>{data.periodName}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Insight Card */}
                <View style={styles.card}>
                    <View style={{ alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 12, color: "#8B95A5", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Financial Status
                        </Text>
                        <Text style={{ fontSize: 28, fontWeight: "700", color: data.insightColor }}>
                            {data.insight}
                        </Text>
                    </View>

                    <View style={{ gap: 12 }}>
                        <View style={styles.barContainer}>
                            <View style={[styles.barFill, { backgroundColor: "#1B998B", flex: 1 }]} />
                            <Text style={[styles.barLabel, { color: "#FFFFFF" }]}>Income 100%</Text>
                        </View>

                        <View style={styles.barContainer}>
                            <View
                                style={[
                                    styles.barFill,
                                    {
                                        backgroundColor: data.totalExpense > data.totalIncome ? "#EF4444" : "#F59E0B",
                                        width: `${Math.min((data.totalExpense / (data.totalIncome || 1)) * 100, 100)}%`
                                    }
                                ]}
                            />
                            <Text style={[styles.barLabel, { color: "#FFFFFF" }]}>
                                Expense {data.totalIncome > 0 ? ((data.totalExpense / data.totalIncome) * 100).toFixed(1) : 0}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Summary Numbers */}
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.card}>
                            <Ionicons name="arrow-down-circle" size={28} color="#1B998B" />
                            <Text style={[styles.label, { color: "#8B95A5" }]}>Income</Text>
                            <Text style={[styles.amount, { color: "#1B998B" }]}>{formatRupiah(data.totalIncome)}</Text>
                        </View>
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.card}>
                            <Ionicons name="arrow-up-circle" size={28} color="#EF4444" />
                            <Text style={[styles.label, { color: "#8B95A5" }]}>Expense</Text>
                            <Text style={[styles.amount, { color: "#EF4444" }]}>{formatRupiah(data.totalExpense)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={[styles.label, { color: "#8B95A5", textAlign: 'center' }]}>Net Balance</Text>
                    <Text style={[styles.netAmount, { color: data.net >= 0 ? "#1B998B" : "#EF4444" }]}>
                        {formatRupiah(data.net)}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
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
    headerSubtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.85)",
        marginTop: 4,
    },
    content: {
        padding: 24,
        gap: 16,
    },
    card: {
        backgroundColor: "#1A2332",
        borderRadius: 16,
        padding: 20,
    },
    row: {
        flexDirection: "row",
    },
    label: {
        fontSize: 12,
        marginTop: 8,
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontWeight: "600",
    },
    amount: {
        fontSize: 18,
        fontWeight: "700",
    },
    netAmount: {
        fontSize: 36,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 8,
    },
    barContainer: {
        height: 36,
        backgroundColor: "#0D1B2A",
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: 'center',
        position: 'relative'
    },
    barFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 10,
    },
    barLabel: {
        marginLeft: 12,
        fontSize: 13,
        fontWeight: "600",
        zIndex: 1,
    }
});
