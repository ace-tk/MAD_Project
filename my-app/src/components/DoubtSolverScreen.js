import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function DoubtSolverScreen({ navigation }) {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (text.trim() === "") return;

    const userMessage = {
      id: Date.now().toString(),
      msg: text.trim(),
      type: "user",
    };

    setChat((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful study assistant. Answer student questions clearly and concisely. Explain concepts in an easy-to-understand way.",
          },
          {
            role: "user",
            content: text.trim(),
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiResponse = response.choices[0].message.content;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        msg: aiResponse,
        type: "ai",
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Doubt solver error:", error);
      Alert.alert(
        "Error",
        error.message?.includes("API key")
          ? "OpenAI API key not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment."
          : "Failed to get response. Please try again.",
        [{ text: "OK" }]
      );

      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        msg: "Sorry, I couldn't process your question. Please check your internet connection and API configuration.",
        type: "error",
      };
      setChat((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.type === "user";
    const isError = item.type === "error";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.msgBox,
            isUser ? styles.userMsgBox : isError ? styles.errorMsgBox : styles.aiMsgBox,
          ]}
        >
          <Text
            style={[
              styles.msgText,
              isUser ? styles.userMsgText : styles.aiMsgText,
            ]}
          >
            {item.msg}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Doubt Solver</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        style={styles.chatList}
        data={chat}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="help-circle-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>Ask me anything!</Text>
            <Text style={styles.emptySubtext}>I'm here to help with your studies</Text>
          </View>
        }
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1D7CF2" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your doubt..."
          value={text}
          onChangeText={setText}
          multiline
          onSubmitEditing={sendMessage}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={loading}
        >
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  aiMessageContainer: {
    alignItems: "flex-start",
  },
  msgBox: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userMsgBox: {
    backgroundColor: "#1D7CF2",
  },
  aiMsgBox: {
    backgroundColor: "#DCF1FF",
  },
  errorMsgBox: {
    backgroundColor: "#FEE2E2",
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMsgText: {
    color: "#fff",
  },
  aiMsgText: {
    color: "#1E293B",
  },
  inputRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: "#1D7CF2",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: {
    color: "#64748B",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 5,
  },
});
