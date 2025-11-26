import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import HomeScreen from "./src/components/HomeScreen"; 

const OnboardingScreen = ({ onStart }) => (
  <View style={styles.onboardingContainer}>
    <Text style={styles.welcome}>Welcome Back!</Text>
    <Text style={styles.subtitle}>Let’s make today productive.</Text>
    <Text style={styles.tagline}>Small steps daily → Big results.</Text>
    <TouchableOpacity style={styles.startButton} onPress={onStart}>
      <Text style={styles.startButtonText}>Start Studying</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return showOnboarding ? (
    <OnboardingScreen onStart={() => setShowOnboarding(false)} />
  ) : (
    <HomeScreen />
  );
}

const styles = StyleSheet.create({
  onboardingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0b0f33",
  },
  welcome: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#cfd2ff",
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#cfd2ff",
    marginBottom: 40,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#4c6ef5",
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
