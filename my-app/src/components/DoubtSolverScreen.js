import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DoubtSolver() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (text.trim() === "") return;
    setChat([...chat, { id: Date.now().toString(), msg: text }]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doubt Solver</Text>

      <FlatList
        style={{ flex: 1 }}
        data={chat}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.msgBox}>
            <Text style={styles.msgText}>{item.msg}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your doubt..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  msgBox: {
    backgroundColor: "#DCF1FF",
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  msgText: { fontSize: 15 },
  inputRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: { flex: 1, fontSize: 16 },
  sendBtn: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
});
