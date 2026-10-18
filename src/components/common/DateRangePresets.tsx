import { Text, TouchableOpacity, View } from "react-native";
import { getToday, getLastNDays, getCurrentMonth } from "../../utils/datePresets";

type PresetOption = {
    label: string;
    getValue: () => { from: string; to: string };
};

const PRESETS: PresetOption[] = [
    {
        label: "Hari Ini",
        getValue: getToday,
    },
    {
        label: "7 Hari",
        getValue: () => getLastNDays(7),
    },
    {
        label: "30 Hari",
        getValue: () => getLastNDays(30),
    },
    {
        label: "Bulan Ini",
        getValue: getCurrentMonth,
    },
];

type Props = {
    onSelect: (from: string, to: string) => void;
    onClear: () => void;
    activePreset: string | null;
};

export function DateRangePresets({ onSelect, onClear, activePreset }: Props) {
    return (
        <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Period
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {PRESETS.map((preset) => {
                    const isActive = activePreset === preset.label;
                    return (
                        <TouchableOpacity
                            key={preset.label}
                            onPress={() => {
                                const range = preset.getValue();
                                onSelect(range.from, range.to);
                            }}
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 8,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: isActive ? "#1B998B" : "#2A3544",
                                backgroundColor: isActive ? "#1B998B" : "#0D1B2A",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: isActive ? "#FFFFFF" : "#8B95A5",
                                }}
                            >
                                {preset.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity
                    onPress={onClear}
                    style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: activePreset === null ? "#1B998B" : "#2A3544",
                        backgroundColor: activePreset === null ? "#1B998B" : "#0D1B2A",
                    }}
                >
                    <Text style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: activePreset === null ? "#FFFFFF" : "#8B95A5"
                    }}>
                        All
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
