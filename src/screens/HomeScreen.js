import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StreakBadge from "../components/StreakBadge";
import { useFocusEffect } from "@react-navigation/native";
export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [todayDone, setTodayDone] = useState(false);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.multiGet(["prayerStreak", "lastPrayerDate", "prayerTimes"])
        .then(([s, d, t]) => {
          let currentStreak = parseInt(s?.[1] || "0", 10);
          const lastDate = d?.[1];
          const today = new Date().toISOString().slice(0, 10);
          setTodayDone(lastDate === today);
          setStreak(currentStreak);
        });
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>PrayFocus</Text>
      <Text style={styles.subtitle}>When notification hits, you pray. No swipe away.</Text>
      <StreakBadge streak={streak} todayDone={todayDone} />
      <TouchableOpacity
        style={[styles.startBtn, todayDone && styles.startBtnDone]}
        onPress={() => navigation.navigate("Prayer")}
        disabled={todayDone}
      >
        <Text style={styles.startBtnText}>
          {todayDone ? "Today's prayer complete ✨" : "Start Prayer Session"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingBtn} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.settingBtnText}>⚙️ Set reminder time</Text>
      </TouchableOpacity>
      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>How it works</Text>
        <Text style={styles.tipText}>1. Set your daily prayer time</Text>
        <Text style={styles.tipText}>2. At that time, an overlay locks your screen</Text>
        <Text style={styles.tipText}>3. Hold for 3 seconds, then pray for 60 seconds</Text>
        <Text style={styles.tipText}>4. Your streak grows. Your focus returns.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  header: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1a1a2e",
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  startBtn: {
    backgroundColor: "#e94560",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  startBtnDone: {
    backgroundColor: "#2ecc71",
    shadowColor: "#2ecc71",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  settingBtn: {
    marginTop: 16,
    padding: 12,
  },
  settingBtnText: {
    color: "#555",
    fontSize: 14,
  },
  tipBox: {
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 22,
  },
});
