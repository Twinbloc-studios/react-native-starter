import { type ComponentProps } from "react";
import { type Toaster } from "sonner-native";

import { colors } from "@/components";

type ToastOptions = ComponentProps<typeof Toaster>["toastOptions"];

export const toastOptions: ToastOptions = {
  style: {
    backgroundColor: colors.charcoal[900],
    borderWidth: 0,
  },
  cancelButtonTextStyle: {
    color: "white",
  },
  descriptionStyle: {
    color: "white",
    fontSize: 14,
  },
  titleStyle: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  success: {
    backgroundColor: colors.charcoal[900],
  },
  error: {
    backgroundColor: colors.danger[800],
  },
  warning: {
    backgroundColor: colors.warning[500],
  },
};
