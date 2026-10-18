import { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { FilterState, SortBy } from "../../models/FilterTypes";
import { DateRangePresets } from "./DateRangePresets";
import { listActiveCategories, type Category } from "../../repositories/categoryRepo";
import { countActiveFilters } from "../../services/filterService";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { iconNames, iconSizes } from "../../theme/icons";

type Props = {
    filter: FilterState;
    onFilterChange: (filter: FilterState) => void;
    onReset: () => void;
};

export function FilterPanel({ filter, onFilterChange, onReset }: Props) {
    const [expanded, setExpanded] = useState(false);
    const { colors } = useTheme();
    const categories = listActiveCategories();
    const activeCount = countActiveFilters(filter);

    // Determine active preset based on current filter
    const getActivePreset = (): string | null => {
        if (!filter.dateFrom || !filter.dateTo) return null;

        const now = new Date();
        const from = new Date(filter.dateFrom);
        const to = new Date(filter.dateTo);

        // Normalize dates to start of day for comparison
        const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const normalizedFrom = normalizeDate(from);
        const normalizedTo = normalizeDate(to);
        const normalizedNow = normalizeDate(now);

        // Check if it's today
        if (normalizedFrom.getTime() === normalizedNow.getTime() &&
            normalizedTo.getTime() === normalizedNow.getTime()) {
            return "Hari Ini";
        }

        // Check if it's 7 days (today - 6 days ago)
        const sevenDaysAgo = new Date(normalizedNow);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        if (normalizedFrom.getTime() === sevenDaysAgo.getTime() &&
            normalizedTo.getTime() === normalizedNow.getTime()) {
            return "7 Hari";
        }

        // Check if it's 30 days (today - 29 days ago)
        const thirtyDaysAgo = new Date(normalizedNow);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        if (normalizedFrom.getTime() === thirtyDaysAgo.getTime() &&
            normalizedTo.getTime() === normalizedNow.getTime()) {
            return "30 Hari";
        }

        // Check if it's current month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        if (normalizedFrom.getTime() === monthStart.getTime() &&
            normalizedTo.getTime() === normalizeDate(monthEnd).getTime()) {
            return "Bulan Ini";
        }

        return null;
    };

    return (
        <View style={{ gap: 12 }}>
            {/* Toggle Button */}
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "#2A3544",
                    borderRadius: 12,
                    backgroundColor: "#1A2332",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="filter-outline" size={20} color="#1B998B" />
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}>
                        Filter & Sort
                    </Text>
                    {activeCount > 0 && (
                        <View
                            style={{
                                backgroundColor: "#1B998B",
                                borderRadius: 999,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                            }}
                        >
                            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>
                                {activeCount}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {activeCount > 0 && (
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onReset();
                            }}
                            style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                        >
                            <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600" }}>
                                Reset
                            </Text>
                        </TouchableOpacity>
                    )}
                    <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#8B95A5"
                    />
                </View>
            </TouchableOpacity>

            {/* Filter Content */}
            {expanded && (
                <View
                    style={{
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#2A3544",
                        borderRadius: 12,
                        gap: 16,
                        backgroundColor: "#1A2332",
                    }}
                >
                    {/* Date Range Presets */}
                    <DateRangePresets
                        activePreset={getActivePreset()}
                        onSelect={(from, to) => {
                            onFilterChange({ ...filter, dateFrom: from, dateTo: to });
                        }}
                        onClear={() => {
                            onFilterChange({ ...filter, dateFrom: null, dateTo: null });
                        }}
                    />

                    {/* Transaction Type */}
                    <View style={{ gap: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Transaction Type
                        </Text>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                            {(["all", "income", "expense"] as const).map((type) => {
                                const isActive = filter.transactionType === type;
                                const labels = {
                                    all: "All",
                                    income: "Income",
                                    expense: "Expense",
                                };
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => {
                                            onFilterChange({ ...filter, transactionType: type });
                                        }}
                                        style={{
                                            flex: 1,
                                            paddingHorizontal: 12,
                                            paddingVertical: 10,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: isActive ? "#1B998B" : "#2A3544",
                                            backgroundColor: isActive ? "#1B998B" : "#0D1B2A",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: "600",
                                                color: isActive ? "#FFFFFF" : "#8B95A5",
                                            }}
                                        >
                                            {labels[type]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Categories */}
                    <View style={{ gap: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Category
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 8 }}
                        >
                            {categories.map((cat) => {
                                const isActive = filter.categoryIds.includes(cat.id);
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => {
                                            const newIds = isActive
                                                ? filter.categoryIds.filter((id) => id !== cat.id)
                                                : [...filter.categoryIds, cat.id];
                                            onFilterChange({ ...filter, categoryIds: newIds });
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
                                            {cat.icon ? `${cat.icon} ` : ""}
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Sort Options */}
                    <View style={{ gap: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B95A5", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Sort By
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                            {(
                                [
                                    { value: "date-desc", label: "Newest" },
                                    { value: "date-asc", label: "Oldest" },
                                    { value: "amount-desc", label: "Highest" },
                                    { value: "amount-asc", label: "Lowest" },
                                ] as const
                            ).map((option) => {
                                const isActive = filter.sortBy === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => {
                                            onFilterChange({ ...filter, sortBy: option.value });
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
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
