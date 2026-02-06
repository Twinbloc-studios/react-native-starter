import { Env } from "@env";
import * as StoreReview from "expo-store-review";
import { Linking, Platform } from "react-native";

const IOS_APP_ID = "********";
const ANDROID_PACKAGE_NAME = "com.get.********";

export const rateApp = async () => {
  const isAvailable = await StoreReview.isAvailableAsync();

  if (isAvailable) {
    try {
      await StoreReview.requestReview();
      return;
    } catch (error) {
      console.error("Error requesting review:", error);
      // Fallback to opening store URL
    }
  }

  // Fallback: Open Store URL
  if (Platform.OS === "android") {
    // Android Store URL
    // Use the specific store package name provided
    const packageName = ANDROID_PACKAGE_NAME || Env.PACKAGE;

    await Linking.openURL(`market://details?id=${packageName}`).catch(() => {
      void Linking.openURL(
        `https://play.google.com/store/apps/details?id=${packageName}`,
      );
    });
  } else if (Platform.OS === "ios") {
    // iOS App Store URL
    await Linking.openURL(
      `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${IOS_APP_ID}?action=write-review`,
    ).catch(() => {
      // Fallback to standard https link if itms-apps fails
      void Linking.openURL(
        `https://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`,
      );
    });
  }
};
