import { toast } from "sonner-native";

// Documentation: https://sonner-native.netlify.app/
//
// Sample usage:
// ShowToast.success("Saved", "Your changes are live");
// ShowToast.error("Failed", { description: "Try again", duration: 6000 });
// ShowToast.setDefaults({ position: "bottom-center", duration: 5000 });
// ShowToast.loading("Syncing...");
// ShowToast.dismiss();

type ToastMessage = Parameters<typeof toast>[0];
type ToastOptions = Parameters<typeof toast>[1];
type ToastPromiseOptions = Parameters<typeof toast.promise>[1];

const baseDefaults: ToastOptions = {
  position: "top-center",
  duration: 4000,
};

let defaultOptions: ToastOptions = { ...baseDefaults };

const resolveOptions = (descriptionOrOptions?: string | ToastOptions, options?: ToastOptions) => {
  if (typeof descriptionOrOptions === "string") {
    return {
      ...defaultOptions,
      ...options,
      description: descriptionOrOptions,
    };
  }

  return {
    ...defaultOptions,
    ...descriptionOrOptions,
  };
};

export const ShowToast = {
  setDefaults: (options?: ToastOptions) => {
    defaultOptions = {
      ...defaultOptions,
      ...options,
    };
  },
  resetDefaults: () => {
    defaultOptions = { ...baseDefaults };
  },
  show: (message: ToastMessage, options?: ToastOptions) => {
    return toast(message, resolveOptions(options));
  },
  success: (message: ToastMessage, descriptionOrOptions?: string | ToastOptions, options?: ToastOptions) => {
    return toast.success(message, resolveOptions(descriptionOrOptions, options));
  },
  error: (message: ToastMessage, descriptionOrOptions?: string | ToastOptions, options?: ToastOptions) => {
    return toast.error(message, resolveOptions(descriptionOrOptions, options));
  },
  warning: (message: ToastMessage, descriptionOrOptions?: string | ToastOptions, options?: ToastOptions) => {
    return toast.warning(message, resolveOptions(descriptionOrOptions, options));
  },
  info: (message: ToastMessage, descriptionOrOptions?: string | ToastOptions, options?: ToastOptions) => {
    return toast.info(message, resolveOptions(descriptionOrOptions, options));
  },
  loading: (message: ToastMessage, descriptionOrOptions?: string | ToastOptions, options?: ToastOptions) => {
    return toast.loading(message, resolveOptions(descriptionOrOptions, options));
  },
  custom: (render: Parameters<typeof toast.custom>[0], options?: ToastOptions) => {
    return toast.custom(render, resolveOptions(options));
  },
  promise: <T>(promise: Promise<T>, options: ToastPromiseOptions) => {
    return toast.promise(promise, options);
  },
  dismiss: (toastId?: Parameters<typeof toast.dismiss>[0]) => {
    return toast.dismiss(toastId);
  },
};
