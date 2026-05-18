import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Vibration, BackHandler } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePrayerTimer } from "../hooks/usePrayerTimer";
export default function PrayerScreen({ navigation }) {
  const [phase, setPhase] = useState("hold"); // hold | praying | complete
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const { secondsLeft, startTimer, isRunning } = usePrayerTimer(60);

  const scale = useSharedValue(1);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (phase === "praying") return true;
      return false;
    });
    return () => backHandler.remove();
  }, [phase]);

  const handlePressIn = () => {
    if (phase !== "hold") return;
    scale.value = withSpring(0.95);
    let progress = 0;
    holdTimerRef.current = setInterval(() => {
      progress += 1;
      setHoldProgress(progress);
      if (progress >= 30) { // 3 seconds at 100ms interval
        clearInterval(holdTimerRef.current);
        Vibration.vibrate(200);
        setPhase("praying");
        startTimer();
      }
    }, 100);
  };

  const handlePressOut = () => {
    if (phase !== "hold") return;
    scale.value = withSpring(1);
    clearInterval(holdTimerRef.current);
    setHoldProgress(0);
  };

  useEffect(() => {
    if (phase === "praying" && secondsLeft === 0) {
      completePrayer();
    }
  }, [secondsLeft, phase]);

  const completePrayer = async () => {
    setPhase("complete");
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = await AsyncStorage.getItem("lastPrayerDate");
    let streak = parseInt(await AsyncStorage.getItem("prayerStreak") || "0", 10);
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      if (lastDate === yesterdayStr) {
        streak += 1;
      } else {
        streak = 1;
      }
      await AsyncStorage.setItem("prayerStreak", String(streak));
      await AsyncStorage.setItem("lastPrayerDate", today);
    }
    setTimeout(() => navigation.navigate("Home"), 2000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {phase === "hold" && (
        <>
          <Text style={styles.bigText}>Hold to begin</Text>
          <Text style={styles.smallText}>Keep your finger down for 3 seconds to enter prayer mode</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${(holdProgress / 30) * 100}%` }]} />
          </View>
          <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={[styles.holdCircle, animatedStyle]}>
              <Text style={styles.holdText}>🥏</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </>
      )}
      {phase === "praying" && (
        <View style={styles.overlay}>
          <Text style={styles.focusText}>Pray now</Text>
          <Text style={styles.timerText}>{secondsLeft}s</Text>
          <Text style={styles.focusSub}>Hold your focus. This screen will not go away.</Text>
        </View>
      )}
      {phase === "complete" && (
        <View style={styles.overlay}>
          <Text style={styles.bigText}>✨ Amen ✨</Text>
          <Text style={styles.smallText}>Your streak grows. See you tomorrow.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  bigText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
  },
  smallText: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 32,
  },
  progressContainer: {
    width: 200,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 40,
    overflow: "hidden",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e94560",
    borderRadius: 2,
  },
  holdCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  holdText: {
    fontSize: 48,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  focusText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 24,
  },
  timerText: {
    fontSize: 80,
    fontWeight: "200",
    color: "#e94560",
    marginBottom: 24,
  },
  focusSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
