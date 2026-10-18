import { useMemo, useCallback, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StatusBar, RefreshControl } from "react-native";
import { getLedger } from "../services/ledgerService";
import { formatDayLabel } from "../utils/dates";
import { groupByDay } from "../services/formatService";
import type { Transaction } from "../models/domain";
import { useFocusEffect } from "@react-navigation/native";
import { FilterPanel } from "../components/common/FilterPanel";
import { DEFAULT_FILTER_STATE, type FilterState } from "../models/FilterTypes";
import { applyFilters } from "../services/filterService";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PeriodSelector } from "../components/common/PeriodSelector";
import { PeriodManagementModal } from "../components/common/PeriodManagementModal";
import { getActivePeriod } from "../repositories/periodRepo";
import { TransactionRow } from "../components/ledger/TransactionRow";

type Row =
  | {
    kind: "day";
    dayKey: string;
    label: string;
    income: number;
    expense: number;
    net: number;
  }
  | { kind: "tx"; tx: Transaction };

function rp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function HomeScreen({ navigation }: any) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [managementModalVisible, setManagementModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, mode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const ledger = useMemo(() => getLedger(), [refreshKey]);
  const activePeriod = useMemo(() => getActivePeriod(), [refreshKey]);

  const filteredTransactions = useMemo(() => {
    return applyFilters(ledger.transactions, filter);
  }, [ledger.transactions, filter]);

  const rows: Row[] = useMemo(() => {
    const groups = groupByDay(filteredTransactions);
    const out: Row[] = [];
    for (const g of groups) {
      out.push({
        kind: "day",
        dayKey: g.dayKey,
        label: formatDayLabel(g.dayKey),
        income: g.income,
        expense: g.expense,
        net: g.net,
      });
      for (const tx of g.items) out.push({ kind: "tx", tx });
    }
    return out;
  }, [filteredTransactions]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1B2A" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Period Management Modal */}
      <PeriodManagementModal
        visible={managementModalVisible}
        onClose={() => {
          setManagementModalVisible(false);
          setRefreshKey((k) => k + 1);
        }}
        activePeriod={activePeriod}
        currentBalance={ledger.balance}
      />

      {/* Transaction List with Header */}
      <FlatList
        data={rows}
        keyExtractor={(item, idx) =>
          (item.kind === "day" ? `day-${item.dayKey}` : item.tx.id) + "-" + idx
        }
        ListHeaderComponent={
          <>
            {/* Header with Gradient */}
            <LinearGradient
              colors={["#1B998B", "#06D6A0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingTop: 50,
                paddingBottom: 24, // Added slight padding bottom
                paddingHorizontal: 20,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
              }}
            >
              {/* Top Bar - Compact Layout */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end", // Align bottom
                }}
              >
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>
                      Total Balance
                    </Text>
                    {activePeriod && (
                      <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>{activePeriod.name}</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "700",
                      color: "#FFFFFF",
                      letterSpacing: 0.5,
                      lineHeight: 32,
                    }}
                  >
                    {rp(ledger.balance)}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8, paddingBottom: 2 }}>
                  <TouchableOpacity
                    onPress={() => setManagementModalVisible(true)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>



            {/* Content */}
            <View style={{ paddingHorizontal: 24, paddingTop: 24, gap: 16 }}>
              {/* Add Transaction Button */}
              <TouchableOpacity
                onPress={() => navigation.navigate("AddTransaction")}
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
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  Add Transaction
                </Text>
              </TouchableOpacity>

              {/* Filter Panel */}
              <FilterPanel
                filter={filter}
                onFilterChange={setFilter}
                onReset={() => setFilter(DEFAULT_FILTER_STATE)}
              />

              {/* Transactions Header */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  Transactions
                </Text>
                {filteredTransactions.length > 0 && (
                  <Text style={{ fontSize: 13, color: "#8B95A5" }}>
                    {filteredTransactions.length} items
                  </Text>
                )}
              </View>
            </View>
          </>
        }
        renderItem={({ item }) =>
          item.kind === "day" ? (
            <DayHeader item={item} />
          ) : (
            <TransactionRow
              tx={item.tx}
              onPress={() =>
                navigation.navigate("TransactionDetail", { id: item.tx.id })
              }
            />
          )
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#1A2332",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="wallet-outline" size={40} color="#4A5568" />
            </View>
            <Text
              style={{
                color: "#8B95A5",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              No transactions yet
            </Text>
            <Text
              style={{
                color: "#4A5568",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Start by adding your first transaction
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#1B998B"]}
            tintColor="#1B998B"
            progressBackgroundColor="#1A2332"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

function DayHeader({ item }: { item: Extract<Row, { kind: "day" }> }) {
  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: 12, // Reduced from 16
        paddingBottom: 4, // Reduced from 8
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Text style={{ fontWeight: "700", fontSize: 13, color: "#8B95A5", textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {item.label}
      </Text>
      <Text style={{ color: "#4A5568", fontSize: 11 }}>
        In: {rp(item.income)} • Out: {rp(item.expense)}
      </Text>
    </View>
  );
}
