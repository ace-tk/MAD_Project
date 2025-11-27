// src/components/ExpensesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@expenses_transactions_v1";

function formatCurrency(n) {
  // simple formatting
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function ExpensesScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // form state
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income"); // income | expense
  const [note, setNote] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    // save on change
    persistTransactions(transactions);
  }, [transactions]);

  async function loadTransactions() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTransactions(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to load transactions", e);
    }
  }

  async function persistTransactions(list) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save transactions", e);
    }
  }

  function resetForm() {
    setAmount("");
    setType("income");
    setNote("");
  }

  function openAddModal() {
    resetForm();
    setModalVisible(true);
  }

  function addTransaction() {
    const v = parseFloat(amount);
    if (isNaN(v) || v <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount > 0");
      return;
    }

    const newTxn = {
      id: Date.now().toString(),
      amount: v,
      type,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    // put newest at top
    setTransactions((prev) => [newTxn, ...prev]);
    setModalVisible(false);
  }

  function deleteTransaction(id) {
    Alert.alert("Delete", "Delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTransactions((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  }

  // compute today's totals (based on date - local)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTxns = transactions.filter((t) => t.date.slice(0, 10) === todayStr);

  const totalIncome = todayTxns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = todayTxns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const totalNet = totalIncome - totalExpenses;

  const renderTxn = ({ item }) => {
    const isIncome = item.type === "income";
    return (
      <TouchableOpacity
        style={styles.txnRow}
        onLongPress={() => deleteTransaction(item.id)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.txnNote}>{item.note || (isIncome ? "Income" : "Expense")}</Text>
          <Text style={styles.txnDate}>
            {new Date(item.date).toLocaleString()}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.txnAmount, { color: isIncome ? "#10b981" : "#ef4444" }]}>
            {isIncome ? "+" : "-"}{formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today Transactions</Text>
        <TouchableOpacity onPress={loadTransactions}>
          <Text style={styles.refresh}>⟳</Text>
        </TouchableOpacity>
      </View>

      {/* Totals Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total</Text>

        <Text style={styles.totalAmount}>{formatCurrency(totalNet)}</Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.colLabel}>Income</Text>
            <Text style={[styles.colValue, { color: "#10b981" }]}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.colLabel}>Expenses</Text>
            <Text style={[styles.colValue, { color: "#ef4444" }]}>{formatCurrency(totalExpenses)}</Text>
          </View>
        </View>
      </View>

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ Add Record</Text>
      </TouchableOpacity>

      {/* List or placeholder */}
      {todayTxns.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🧾</Text>
          <Text style={styles.emptyText}>No Transactions of Today.</Text>
        </View>
      ) : (
        <FlatList
          style={{ marginTop: 12 }}
          data={todayTxns}
          keyExtractor={(i) => i.id}
          renderItem={renderTxn}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Modal for add */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalWrapper}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeBtn, type === "income" && styles.typeBtnActive]}
                onPress={() => setType("income")}
              >
                <Text style={[styles.typeText, type === "income" && { color: "#065f46" }]}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, type === "expense" && styles.typeBtnActive]}
                onPress={() => setType("expense")}
              >
                <Text style={[styles.typeText, type === "expense" && { color: "#7f1d1d" }]}>Expense</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
            <TextInput
              placeholder="Note (optional)"
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
              style={styles.input}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ef4444" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#2563EB" }]}
                onPress={addTransaction}
              >
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  back: { fontSize: 20, color: "#111827" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  refresh: { fontSize: 18, color: "#2563EB" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    // subtle shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, color: "#111827", marginBottom: 6 },
  totalAmount: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  col: { alignItems: "center", flex: 1 },
  colLabel: { color: "#6B7280" },
  colValue: { fontSize: 16, fontWeight: "700", marginTop: 6 },

  addButton: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "700" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12, color: "#9CA3AF" },
  emptyText: { fontSize: 16, color: "#6B7280" },

  txnRow: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EEF9",
  },
  txnNote: { fontWeight: "700", color: "#111827" },
  txnDate: { color: "#6B7280", marginTop: 4, fontSize: 12 },
  txnAmount: { fontWeight: "800", fontSize: 16 },

  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  typeRow: { flexDirection: "row", marginBottom: 12 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  typeBtnActive: { backgroundColor: "#D1FAE5" },
  typeText: { fontWeight: "700", color: "#374151" },

  input: {
    backgroundColor: "#F8FAFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E6EEF9",
  },

  modalBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 6 },
  modalBtnText: { color: "white", fontWeight: "700" },
});
