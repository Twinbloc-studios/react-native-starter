import { toast, type ToastMessage } from "goey-native-toast";
import { useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";

import { Text } from "../ui/text";
import { View } from "../ui/view";
import { WIDTH } from "./ui-utils";

interface ConfirmationOptions {
  title?: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  updateOptions?: Partial<ToastMessage>;
}

let activeConfirmationId: string = "";

// Sample usage:
// confirmDialog({
//   title: "Delete item?",
//   description: "This action cannot be undone.",
//   variant: "destructive",
//   confirmLabel: "Delete",
//   cancelLabel: "Cancel",
//   onConfirm: async () => {
//     await deleteItem();
//   },
//   updateOptions: {
//     title: "Item deleted",
//     description: "Your item has been removed.",
//   },
// });
export const confirmDialog = ({
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  updateOptions,
}: ConfirmationOptions) => {
  if (activeConfirmationId) {
    toast.dismiss(activeConfirmationId);
  }
  const isDestructive = variant === "destructive";

  const CompletedBody = ({ description }: { description?: string }) => (
    <View
      style={{ width: WIDTH * 0.9 }}
      className="w-full self-center rounded-2xl px-4"
    >
      <Text className="text-sm py-2 leading-5 text-white">
        {description || "Action completed successfully"}
      </Text>
    </View>
  );

  const ConfirmationBody = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      try {
        await Promise.resolve(onConfirm());
        const shouldUseDefaultBody =
          updateOptions?.customBody === undefined &&
          updateOptions?.title === undefined &&
          updateOptions?.description === undefined;

        toast.update(activeConfirmationId, {
          title: updateOptions?.title || "Success",
          autoDismiss: true,
          duration: 4000,
          dismissible: true,
          backgroundColor: isDestructive ? "#006400" : "#7FFF00",
          ...(shouldUseDefaultBody ? { customBody: <CompletedBody /> } : {}),
          ...updateOptions,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View
        style={{ width: WIDTH * 0.9 }}
        className={`w-full self-center rounded-2xl px-4 `}
      >
        {/* <View className="flex-row items-center gap-2">
          {isDestructive ? <MaterialIcons name="remove-circle" size={22} color="white" /> : <MaterialIcons name="info" size={22} color="white" />}
          <Text className="text-lg font-bold text-white">{title}</Text>
        </View> */}
        <Text className="text-sm leading-5 text-white">{description}</Text>
        <View className="mt-4 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            accessibilityHint="Cancels the action"
            onPress={() => {
              if (isLoading) {
                return;
              }
              onCancel?.();
              toast.dismiss(activeConfirmationId);
            }}
            className="flex-1 items-center justify-center rounded-xl border border-white py-2"
          >
            <Text className="text-[15px] font-semibold text-white">
              {cancelLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            accessibilityHint="Confirms the action"
            onPress={handleConfirm}
            disabled={isLoading}
            className="flex-1 items-center justify-center rounded-xl bg-white py-2"
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={isDestructive ? "#991b1b" : "#1e3a8a"}
              />
            ) : (
              <Text
                className={`text-[15px] font-semibold ${isDestructive ? "text-danger-800" : "text-blue-900"}`}
              >
                {confirmLabel}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  activeConfirmationId = toast.custom(title, {
    backgroundColor: isDestructive ? "red" : "blue",
    textStyle: { color: "white" },
    iconColor: "white",
    autoDismiss: false,
    position: "top-left",
    duration: Infinity,
    expandWithSpring: true,
    onDismiss: () => {
      activeConfirmationId = "";
    },
    // style: { backgroundColor: "transparent", borderWidth: 0, padding: 0 },
    customBody: <ConfirmationBody />,
  });
};
