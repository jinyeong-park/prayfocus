import React from "react";
import { View, Text, StyleSheet } from "react-native";
export default function StreakBadge({ streak, todayDone }) {
  const flames = "🔥".repeat(Math.min(streak, 7));
  return (
    <View style={[styles.badge, todayDone && styles.badgeDone]}>
      <Text style={styles.flameText}>{todayDone ? "✨" : flames || "🔥"}</Text>
      <Text style={styles.streakText}>
        {todayDone ? "Done today!" : `${streak} day streak`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#fff3f5",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e94560",
    marginVertical: 12,
  },
  badgeDone: {
    backgroundColor: "#e8f8f5",
    borderColor: "#2ecc71",
  },
  flameText: {
    fontSize: 28,
    marginBottom: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
});
