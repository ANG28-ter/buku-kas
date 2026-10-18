import { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { iconNames, iconSizes } from "../../theme/icons";
import type { Period } from "../../models/domain";
import { getAllPeriods, setActivePeriod } from "../../repositories/periodRepo";
import { deletePeriod } from "../../services/periodService";

type PeriodSelectorProps = {
    activePeriod: Period | null;
    onPeriodChange: () => void;
};

export function PeriodSelector({
    activePeriod,
    onPeriodChange,
}: PeriodSelectorProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { colors } = useTheme();
    const periods = getAllPeriods();

    const handleSelectPeriod = (periodId: string) => {
        setActivePeriod(periodId);
        setModalVisible(false);
        onPeriodChange();
    };

    const handleDeletePeriod = (period: Period) => {
        Alert.alert(
            "Hapus Periode",
            `Apakah Anda yakin ingin menghapus periode "${period.name}"?\n\nTindakan ini tidak dapat dibatalkan.`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => {
                        try {
                            deletePeriod(period.id);
                            Alert.alert("Berhasil", "Periode berhasil dihapus.");
                            onPeriodChange();
                        } catch (error: any) {
                            Alert.alert("Gagal", error?.message ?? "Gagal menghapus periode.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: colors.surfaceSecondary,
                    borderWidth: 1,
                    borderColor: colors.border,
                }}
            >
                <Ionicons
                    name={iconNames.calendar}
                    size={iconSizes.sm}
                    color={colors.primary}
                />
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.text,
                    }}
                >
                    {activePeriod?.name ?? "Pilih Periode"}
                </Text>
                <Ionicons
                    name={iconNames.chevronDown}
                    size={iconSizes.sm}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            width: "85%",
                            maxHeight: "70%",
                            backgroundColor: colors.surface,
                            borderRadius: 16,
                            padding: 20,
                        }}
                        onStartShouldSetResponder={() => true}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "700",
                                    color: colors.text,
                                }}
                            >
                                Pilih Periode
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons
                                    name={iconNames.close}
                                    size={iconSizes.md}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {periods.map((period) => {
                                const isActive = period.id === activePeriod?.id;
                                return (
                                    <TouchableOpacity
                                        key={period.id}
                                        onPress={() => handleSelectPeriod(period.id)}
                                        style={{
                                            padding: 16,
                                            borderRadius: 12,
                                            marginBottom: 8,
                                            backgroundColor: isActive
                                                ? colors.primary
                                                : colors.backgroundSecondary,
                                            borderWidth: 1,
                                            borderColor: isActive ? colors.primary : colors.border,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: "600",
                                                        color: isActive ? "#FFFFFF" : colors.text,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {period.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: isActive
                                                            ? "rgba(255,255,255,0.8)"
                                                            : colors.textSecondary,
                                                    }}
                                                >
                                                    {new Date(period.start_date).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                    {period.end_date
                                                        ? ` - ${new Date(period.end_date).toLocaleDateString("id-ID")}`
                                                        : " - Sekarang"}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                {!isActive && (
                                                    <TouchableOpacity
                                                        onPress={(e) => {
                                                            e.stopPropagation();
                                                            handleDeletePeriod(period);
                                                        }}
                                                        style={{
                                                            padding: 8,
                                                            borderRadius: 8,
                                                            backgroundColor: "rgba(255,59,48,0.1)",
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name={iconNames.delete}
                                                            size={iconSizes.sm}
                                                            color={colors.danger}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                                {isActive && (
                                                    <Ionicons
                                                        name={iconNames.checkmark}
                                                        size={iconSizes.md}
                                                        color="#FFFFFF"
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}
