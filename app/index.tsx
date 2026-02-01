import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCounterStore } from "@/src/state/useCounterStore";

export default function Index() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Twinbloc Starter</Text>
        <Text style={styles.subtitle}>Edit app/index.tsx to customize.</Text>
        <Text style={styles.counter}>Count: {count}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={decrement}>
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={increment}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={reset}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A"
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 12
  },
  title: {
    color: "#F5F7FF",
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    color: "#B2B9D2",
    textAlign: "center"
  },
  counter: {
    color: "#F5F7FF",
    fontSize: 24,
    fontWeight: "600"
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#4C6FFF"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600"
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4C6FFF"
  },
  secondaryButtonText: {
    color: "#4C6FFF",
    fontSize: 16,
    fontWeight: "600"
  }
});
