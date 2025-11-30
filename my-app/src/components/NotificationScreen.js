import React from "react";
import { View, Text } from "react-native";

export default function NotificationScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Notifications</Text>

      <Text style={{ marginTop: 20, fontSize: 16, color: "gray" }}>
        No new notifications.
      </Text>
    </View>
  );
}
