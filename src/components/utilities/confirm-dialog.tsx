import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { toast } from "sonner-native";
import { Pressable, View } from "react-native";

import { Text } from "../ui/text";

interface ConfirmationOptions {
  id?: string | number;
  title?: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

let activeConfirmationId: string | number | null = null;

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
//   onCancel: () => {
//     console.log("Canceled");
//   },
// });
export const confirmDialog = ({
  id,
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ConfirmationOptions) => {
  if (activeConfirmationId) {
    toast.dismiss(activeConfirmationId);
  }

  const toastId = id ?? `modal-${Date.now()}`;
  const isDestructive = variant === "destructive";

  const handleConfirm = async () => {
    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        toast.loading("Loading", {
          id: toastId,
          description: "Please wait...",
          duration: Infinity,
          dismissible: false,
          action: undefined,
          cancel: undefined,
        });
        await result;
      }
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      toast.dismiss(toastId);
      if (activeConfirmationId === toastId) {
        activeConfirmationId = null;
      }
    }
  };

  activeConfirmationId = toast.custom(
    <View className={`w-[95%] self-center rounded-2xl p-5 ${isDestructive ? "bg-danger-600" : "bg-blue-900"}`}>
      <View className="flex-row items-center gap-2">
        {isDestructive ? <MaterialIcons name="remove-circle" size={22} color="white" /> : <MaterialIcons name="info" size={22} color="white" />}
        <Text className="text-white text-lg font-bold">{title}</Text>
      </View>
      <Text className="text-white text-sm leading-5 mt-3">{description}</Text>
      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={() => {
            onCancel?.();
            toast.dismiss(toastId);
          }}
          className="flex-1 rounded-xl border border-white py-2 items-center justify-center"
        >
          <Text className="text-white text-[15px] font-semibold">{cancelLabel}</Text>
        </Pressable>
        <Pressable onPress={handleConfirm} className="flex-1 rounded-xl bg-white py-2 items-center justify-center">
          <Text className={`text-[15px] font-semibold ${isDestructive ? "text-danger-800" : "text-blue-900"}`}>{confirmLabel}</Text>
        </Pressable>
      </View>
    </View>,
    {
      id: toastId,
      dismissible: false,
      position: "center",
      duration: Infinity,
      onDismiss: () => {
        activeConfirmationId = null;
      },
      style: {
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
      },
    },
  );
};
