import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
export default function SettingsScreen() {
  const [time, setTime] = useState({ hour: 7, minute: 0 });
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("prayerTime").then((val) => {
      if (val) {
        const [h, m] = val.split(":").map(Number);
        setTime({ hour: h, minute: m });
      }
    });
  }, []);

  const scheduleNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "PrayFocus 🕊️",
        body: "It's time to pause and pray. Hold for 3 seconds to begin.",
        data: { type: "prayer_reminder" },
      },
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
    await AsyncStorage.setItem("prayerTime", `${time.hour}:${time.minute}`);
    setScheduled(true);
  };

  const adjustTime = (field, delta) => {
    setTime((prev) => {
      let val = prev[field] + delta;
      if (field === "hour") {
        if (val > 23) val = 0;
        if (val < 0) val = 23;
      } else {
        if (val > 59) val = 0;
        if (val < 0) val = 59;
      }
      return { ...prev, [field]: val };
    });
    setScheduled(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Prayer Time</Text>
      <Text style={styles.sub}>When this time hits, your screen will be locked until you pray.</Text>
      <View style={styles.pickerRow}>
        <View style={styles.pickerUnit}>
          <TouchableOpacity onPress={() => adjustTime("hour", 1)}>
            <Text style={styles.arrow}>▲</Text>
          </TouchableOpacity>
          <Text style={styles.number}>{String(time.hour).padStart(2, "0")}</Text>
          <TouchableOpacity onPress={() => adjustTime("hour", -1)}>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.pickerUnit}>
          <TouchableOpacity onPress={() => adjustTime("minute", 1)}>
            <Text style={styles.arrow}>▲</Text>
          </TouchableOpacity>
          <Text style={styles.number}>{String(time.minute).padStart(2, "0")}</Text>
          <TouchableOpacity onPress={() => adjustTime("minute", -1)}>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.scheduleBtn} onPress={scheduleNotification}>
        <Text style={styles.scheduleBtnText}>
          {scheduled ? "✅ Scheduled!" : "Schedule daily reminder"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 32,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    marginTop: 40,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  pickerUnit: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  arrow: {
    fontSize: 24,
    color: "#e94560",
    fontWeight: "700",
    paddingVertical: 8,
  },
  number: {
    fontSize: 48,
    fontWeight: "200",
    color: "#1a1a2e",
    paddingVertical: 8,
  },
  colon: {
    fontSize: 36,
    fontWeight: "200",
    color: "#999",
    paddingBottom: 8,
  },
  scheduleBtn: {
    backgroundColor: "#1a1a2e",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  scheduleBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
