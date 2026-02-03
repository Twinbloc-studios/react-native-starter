import { useBottomSheet, Text, BottomSheet, Button, Accordion, Container, Avatar } from "@/components/ui";
import { confirmDialog, ShowToast } from "@/components/utilities";
import { translate, useSelectedLanguage } from "@/lib/i18n";
import { useCounterStore } from "@/store/useCounterStore";
import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function Index() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  const { ref: bottomSheetRef, present: openModal, dismiss: closeModal } = useBottomSheet();
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const { setLanguage, language } = useSelectedLanguage();
  console.log("🚀 ~ Index ~ language:", language);

  const SECTIONS = [
    { title: "Accordion Section 1", content: "Content for section 1" },
    { title: "Accordion Section 2", content: "Content for section 2" },
  ];

  return (
    <Container.Insets style={styles.safeArea}>
      <View style={styles.container}>
        <Text className="text-green-400 text-2xl font-bold">{translate("common.appName")}</Text>
        <Text style={styles.subtitle}>{translate("common.editHint")}</Text>
        <Text style={styles.counter}>{translate("counter.label", { count })}</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Avatar size="md" label="Jane Doe" />
          <Avatar size="lg" source={{ uri: "https://i.pravatar.cc/150?img=32" }} />
          <Avatar size={52} fallback={<MaterialIcons name="person" size={24} color="white" />} />
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={decrement}>
            <Text style={styles.buttonText}>{translate("counter.decrement")}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={increment}>
            <Text style={styles.buttonText}>{translate("counter.increment")}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={reset}>
            <Text style={styles.secondaryButtonText}>{translate("counter.reset")}</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.confirmButton}
          onPress={() =>
            confirmDialog({
              title: "Delete item?",
              description: "This action cannot be undone.",
              variant: "default",
              confirmLabel: "Okay",
              cancelLabel: "Cancel",
              onConfirm: async () => {
                await new Promise((resolve) => setTimeout(resolve, 1800));
              },
            })
          }
        >
          <Text style={styles.confirmButtonText}>Show confirm dialog</Text>
        </Pressable>
        <ProgressBar.Circular initialProgress={30} />

        <Pressable style={styles.modalButton} onPress={() => openModal()}>
          <Text style={styles.modalButtonText}>Open modal</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setLanguage("en");
          }}
        >
          <Text className="text-white">{translate("common.languageSwitch")}</Text>
        </Pressable>
        <Button
          label="toast"
          onPress={() => {
            ShowToast.warning("Okay", { id: "okau", position: "bottom-center" });
          }}
        />

        <View style={{ width: "100%", marginTop: 20 }}>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            onChange={setActiveSections}
            sectionContainerStyle={{
              backgroundColor: "black",
              marginTop: 49,
            }}
            renderHeader={(section, index, isActive) => (
              <View
                style={{
                  padding: 12,
                  backgroundColor: "black",
                  //   backgroundColor: isActive ? "#333" : "#222",
                  borderRadius: 8,
                  marginBottom: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "white" }}>{section.title}</Text>
                <MaterialIcons size={30} name="arrow-drop-down" color={"white"} />
              </View>
            )}
            renderContent={(section) => (
              <View style={{ padding: 12, backgroundColor: "black", borderRadius: 8, marginBottom: 8 }}>
                <Text style={{ color: "#ccc" }}>{section.content}</Text>
              </View>
            )}
          />
        </View>
      </View>

      <BottomSheet ref={bottomSheetRef} title="Modal" detents={["auto", 0.5, 1]}>
        <View className="p-4 gap-3">
          <Text className="text-base text-neutral-900 dark:text-white">This is a modal bottom sheet.</Text>
          <Pressable style={styles.sheetCloseButton} onPress={closeModal}>
            <Text style={styles.sheetCloseButtonText}>Close</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </Container.Insets>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#fff",
    backgroundColor: "#0B0F1A",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: "#F5F7FF",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#B2B9D2",
    textAlign: "center",
  },
  counter: {
    color: "#F5F7FF",
    fontSize: 24,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#4C6FFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4C6FFF",
  },
  secondaryButtonText: {
    color: "#4C6FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#EF4444",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#10B981",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sheetCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#111827",
    alignSelf: "flex-start",
  },
  sheetCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
