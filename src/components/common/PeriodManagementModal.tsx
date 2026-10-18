import { useState, useEffect } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    closePeriodAndStartNew,
    updateActivePeriodBalance,
    getAllPeriodsWithSummary,
    deletePeriod
} from "../../services/periodService";
import { setActivePeriod } from "../../repositories/periodRepo";
import { formatRupiah, parseRupiah } from "../../utils/money";
import type { Period } from "../../models/domain";

type PeriodManagementModalProps = {
    visible: boolean;
    onClose: () => void;
    activePeriod: Period | null;
    currentBalance: number;
};

export function PeriodManagementModal({
    visible,
    onClose,
    activePeriod,
    currentBalance,
}: PeriodManagementModalProps) {
    const [activeTab, setActiveTab] = useState<"close" | "edit" | "manage">("close");
    const [newPeriodName, setNewPeriodName] = useState("");
    const [newBalance, setNewBalance] = useState(0);
    const [periods, setPeriods] = useState<Period[]>([]);

    useEffect(() => {
        if (visible) {
            loadPeriods();
        }
    }, [visible]);

    const loadPeriods = () => {
        // We use getAllPeriodsWithSummary if available, or just getAllPeriods from repo
        // Ideally we want summary to show date range etc.
        try {
            const all = getAllPeriodsWithSummary();
            setPeriods(all);
        } catch (e) {
            console.error(e);
        }
    };

    const handleClosePeriod = () => {
        if (!activePeriod) return;

        const defaultName = new Date().toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
        });

        Alert.alert(
            "Close Period & Start New",
            `Period "${activePeriod.name}" will be closed with ending balance ${formatRupiah(currentBalance)}.\n\nNew period "${newPeriodName || defaultName}" will start with opening balance ${formatRupiah(currentBalance)}.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Close & Start New",
                    style: "destructive",
                    onPress: () => {
                        try {
                            closePeriodAndStartNew(newPeriodName || defaultName);
                            Alert.alert(
                                "Success!",
                                "New period started. Refresh to see changes."
                            );
                            setNewPeriodName("");
                            onClose();
                        } catch (error: any) {
                            Alert.alert("Error", error?.message ?? "Failed to close period");
                        }
                    },
                },
            ]
        );
    };

    const handleEditBalance = () => {
        if (!activePeriod) return;

        Alert.alert(
            "Edit Opening Balance",
            `Opening balance for "${activePeriod.name}" will be changed from ${formatRupiah(activePeriod.starting_balance)} to ${formatRupiah(newBalance)}.\n\nAll transaction balances will be recomputed.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Change Balance",
                    onPress: () => {
                        try {
                            updateActivePeriodBalance(newBalance);
                            Alert.alert(
                                "Success!",
                                "Opening balance updated. Refresh to see changes."
                            );
                            onClose();
                        } catch (error: any) {
                            Alert.alert("Error", error?.message ?? "Failed to update balance");
                        }
                    },
                },
            ]
        );
    };

    const handleDeletePeriod = (period: Period) => {
        Alert.alert(
            "Delete Period",
            `Are you sure you want to delete period "${period.name}"?\n\nALL TRANSACTIONS in this period will be PERMANENTLY DELETED. This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete Forever",
                    style: "destructive",
                    onPress: () => {
                        try {
                            deletePeriod(period.id);
                            loadPeriods(); // Refresh list
                            Alert.alert("Success", "Period deleted.");
                        } catch (error: any) {
                            Alert.alert("Error", error?.message ?? "Failed to delete period");
                        }
                    },
                },
            ]
        );
    };

    const handleSwitchPeriod = (periodId: string) => {
        try {
            setActivePeriod(periodId);
            Alert.alert("Success", "Switched to selected period. Please refresh.");
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "flex-end",
                }}
            >
                <View
                    style={{
                        backgroundColor: "#0D1B2A",
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        paddingTop: 24,
                        paddingBottom: 40,
                        paddingHorizontal: 24,
                        maxHeight: "85%",
                        borderWidth: 1,
                        borderColor: "#2A3544",
                    }}
                >
                    {/* Header */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                color: "#FFFFFF",
                            }}
                        >
                            Manage Period
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                backgroundColor: "#1A2332",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color="#8B95A5"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 8,
                            marginBottom: 24,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setActiveTab("close")}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor:
                                    activeTab === "close" ? "#1B998B" : "#1A2332",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: activeTab === "close" ? "#1B998B" : "#2A3544",
                            }}
                        >
                            <Text style={{ fontWeight: "600", color: activeTab === "close" ? "#FFFFFF" : "#8B95A5", fontSize: 13 }}>
                                Start New
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab("edit")}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor:
                                    activeTab === "edit" ? "#1B998B" : "#1A2332",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: activeTab === "edit" ? "#1B998B" : "#2A3544",
                            }}
                        >
                            <Text style={{ fontWeight: "600", color: activeTab === "edit" ? "#FFFFFF" : "#8B95A5", fontSize: 13 }}>
                                Edit Saldo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab("manage")}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor:
                                    activeTab === "manage" ? "#1B998B" : "#1A2332",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: activeTab === "manage" ? "#1B998B" : "#2A3544",
                            }}
                        >
                            <Text style={{ fontWeight: "600", color: activeTab === "manage" ? "#FFFFFF" : "#8B95A5", fontSize: 13 }}>
                                History
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {activeTab === "close" ? (
                            <View style={{ gap: 20 }}>
                                {/* Current Period Info */}
                                <View style={{ backgroundColor: "#1A2332", padding: 20, borderRadius: 16 }}>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Current Period</Text>
                                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 }}>{activePeriod?.name}</Text>
                                    <Text style={{ fontSize: 15, color: "#8B95A5" }}>Ending Balance: {formatRupiah(currentBalance)}</Text>
                                </View>
                                {/* New Period Name */}
                                <View style={{ backgroundColor: "#1A2332", padding: 20, borderRadius: 16 }}>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>New Period Name</Text>
                                    <TextInput value={newPeriodName} onChangeText={setNewPeriodName} placeholder={new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })} placeholderTextColor="#4A5568" style={{ borderWidth: 1, borderColor: "#2A3544", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: "#FFFFFF", backgroundColor: "#0D1B2A" }} />
                                </View>
                                <View style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: 16, borderRadius: 12, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                    <Ionicons name="warning-outline" size={20} color="#EF4444" />
                                    <Text style={{ fontSize: 13, color: "#EF4444", flex: 1, lineHeight: 18 }}>Old period will be closed. History remains saved.</Text>
                                </View>
                                <TouchableOpacity onPress={handleClosePeriod} style={{ backgroundColor: "#EF4444", borderRadius: 16, paddingVertical: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>Close & Start New</Text>
                                </TouchableOpacity>
                            </View>
                        ) : activeTab === "edit" ? (
                            <View style={{ gap: 20 }}>
                                <View style={{ backgroundColor: "#1A2332", padding: 20, borderRadius: 16 }}>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Current Opening Balance</Text>
                                    <Text style={{ fontSize: 28, fontWeight: "700", color: "#FFFFFF" }}>{formatRupiah(activePeriod?.starting_balance ?? 0)}</Text>
                                </View>
                                <View style={{ backgroundColor: "#1A2332", padding: 20, borderRadius: 16 }}>
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>New Opening Balance (Rp)</Text>
                                    <TextInput value={newBalance === 0 ? "" : newBalance.toString()} onChangeText={(t) => setNewBalance(parseRupiah(t))} keyboardType="numeric" placeholder="Enter new balance" placeholderTextColor="#4A5568" style={{ borderWidth: 1, borderColor: "#2A3544", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 24, fontWeight: "700", color: "#FFFFFF", backgroundColor: "#0D1B2A" }} />
                                    {newBalance > 0 && <Text style={{ fontSize: 13, color: "#8B95A5", marginTop: 8 }}>{formatRupiah(newBalance)}</Text>}
                                </View>
                                <View style={{ backgroundColor: "rgba(27, 153, 139, 0.1)", padding: 16, borderRadius: 12, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                    <Ionicons name="information-circle-outline" size={20} color="#1B998B" />
                                    <Text style={{ fontSize: 13, color: "#1B998B", flex: 1, lineHeight: 18 }}>All transaction balances will be automatically recalculated.</Text>
                                </View>
                                <TouchableOpacity onPress={handleEditBalance} style={{ backgroundColor: "#1B998B", borderRadius: 16, paddingVertical: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
                                    <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>Save New Balance</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ gap: 12 }}>
                                {periods.map((period) => {
                                    const isActive = period.id === activePeriod?.id;
                                    return (
                                        <View key={period.id} style={{ backgroundColor: isActive ? "rgba(27, 153, 139, 0.1)" : "#1A2332", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: isActive ? "#1B998B" : "#2A3544" }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>{period.name}</Text>
                                                {isActive && (
                                                    <View style={{ backgroundColor: "#1B998B", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                                                        <Text style={{ fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>ACTIVE</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View>
                                                    <Text style={{ fontSize: 13, color: "#8B95A5", marginBottom: 2 }}>
                                                        {new Date(period.start_date).toLocaleDateString("id-ID")}
                                                        {period.end_date ? ` - ${new Date(period.end_date).toLocaleDateString("id-ID")}` : " - Now"}
                                                    </Text>
                                                    <Text style={{ fontSize: 13, color: "#8B95A5" }}>Start: {formatRupiah(period.starting_balance)}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                                    {!isActive && (
                                                        <TouchableOpacity onPress={() => handleSwitchPeriod(period.id)} style={{ padding: 8, backgroundColor: "#2A3544", borderRadius: 8 }}>
                                                            <Ionicons name="eye-outline" size={18} color="#FFFFFF" />
                                                        </TouchableOpacity>
                                                    )}
                                                    {!isActive && (
                                                        <TouchableOpacity onPress={() => handleDeletePeriod(period)} style={{ padding: 8, backgroundColor: "rgba(239, 68, 68, 0.2)", borderRadius: 8 }}>
                                                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
