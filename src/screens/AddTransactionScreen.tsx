import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  listActiveCategories,
  type Category,
} from "../repositories/categoryRepo";
import { addTransaction } from "../services/ledgerService";
import { formatRupiah, parseRupiah } from "../utils/money";
import type { TransactionType } from "../models/domain";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function AddTransactionScreen({ navigation }: any) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amountText, setAmountText] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const categories = useMemo(() => listActiveCategories(type), [type]);

  const [categoryId, setCategoryId] = useState<string>("cat_misc");

  const onSave = () => {
    if (amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter an amount greater than 0.");
      return;
    }

    try {
      addTransaction({
        type,
        amount,
        category_id: categoryId || "cat_misc",
        note: note.trim() ? note.trim() : undefined,
        occurred_at: date.toISOString(),
      });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Failed to save", e?.message ?? "Unknown error");
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          paddingBottom: 24,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
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
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#FFFFFF",
              flex: 1,
            }}
          >
            Add Transaction
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Selection */}
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
              fontWeight: "600",
              color: "#8B95A5",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Transaction Type
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => setType("expense")}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: type === "expense" ? "#EF4444" : "#0D1B2A",
                borderWidth: 1,
                borderColor: type === "expense" ? "#EF4444" : "#2A3544",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="arrow-up-outline"
                size={18}
                color={type === "expense" ? "#FFFFFF" : "#8B95A5"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: type === "expense" ? "#FFFFFF" : "#8B95A5",
                }}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setType("income")}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: type === "income" ? "#1B998B" : "#0D1B2A",
                borderWidth: 1,
                borderColor: type === "income" ? "#1B998B" : "#2A3544",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="arrow-down-outline"
                size={18}
                color={type === "income" ? "#FFFFFF" : "#8B95A5"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: type === "income" ? "#FFFFFF" : "#8B95A5",
                }}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Input */}
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
              fontWeight: "600",
              color: "#8B95A5",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Amount
          </Text>
          <View
            style={{
              backgroundColor: "#0D1B2A",
              borderRadius: 12,
              padding: 16,
              borderWidth: 2,
              borderColor: amount > 0 ? "#1B998B" : "#2A3544",
            }}
          >
            <TextInput
              value={amountText}
              onChangeText={(text) => {
                setAmountText(text);
                setAmount(parseRupiah(text));
              }}
              keyboardType="numeric"
              placeholder="Rp 0"
              placeholderTextColor="#4A5568"
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#FFFFFF",
                padding: 0,
              }}
            />
          </View>
          {amount > 0 && (
            <Text style={{ fontSize: 13, color: "#8B95A5", marginTop: 8 }}>
              {formatRupiah(amount)}
            </Text>
          )}
        </View>

        {/* Category Selection */}
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
              fontWeight: "600",
              color: "#8B95A5",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategoryId(cat.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor:
                    categoryId === cat.id ? "#1B998B" : "#0D1B2A",
                  borderWidth: 1,
                  borderColor: categoryId === cat.id ? "#1B998B" : "#2A3544",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {cat.icon && (
                  <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: categoryId === cat.id ? "#FFFFFF" : "#8B95A5",
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selection */}
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
              fontWeight: "600",
              color: "#8B95A5",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: "#0D1B2A",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "#2A3544",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Ionicons name="calendar-outline" size={20} color="#1B998B" />
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Note Input */}
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
              fontWeight: "600",
              color: "#8B95A5",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Note (Optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            placeholderTextColor="#4A5568"
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: "#0D1B2A",
              borderRadius: 12,
              padding: 16,
              fontSize: 14,
              color: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#2A3544",
              textAlignVertical: "top",
              minHeight: 80,
            }}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={onSave}
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
            marginTop: 8,
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Save Transaction
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === "ios");
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}
