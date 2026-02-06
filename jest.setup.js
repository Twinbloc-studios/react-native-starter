import "@testing-library/jest-native/extend-expect";

import { jest } from "@jest/globals";

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Ionicons = (props) => <View {...props} />;
  Ionicons.displayName = "Ionicons";
  const MaterialCommunityIcons = (props) => <View {...props} />;
  MaterialCommunityIcons.displayName = "MaterialCommunityIcons";
  return {
    Ionicons,
    MaterialCommunityIcons,
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MaterialIcons = (props) => <View {...props} />;
  MaterialIcons.displayName = "MaterialIcons";
  return MaterialIcons;
});

jest.mock("@lodev09/react-native-true-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  const mockPresent = jest.fn();
  const mockDismiss = jest.fn();
  const TrueSheet = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      present: mockPresent,
      dismiss: mockDismiss,
    }));
    return <View {...props}>{props.children}</View>;
  });
  TrueSheet.displayName = "TrueSheet";
  return { TrueSheet, __mocks: { mockPresent, mockDismiss } };
});

jest.mock("@shopify/flash-list", () => {
  const React = require("react");
  const { View } = require("react-native");
  const FlashList = ({
    data = [],
    renderItem,
    ListEmptyComponent,
    ...props
  }) => {
    if (!data.length) {
      return (
        <View {...props}>
          {ListEmptyComponent ? <ListEmptyComponent /> : null}
        </View>
      );
    }
    return (
      <View {...props}>
        {data.map((item, index) => {
          const element = renderItem({ item, index });
          return React.cloneElement(element, { key: item?.value ?? index });
        })}
      </View>
    );
  };
  FlashList.displayName = "FlashList";
  return { FlashList };
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Image = (props) => <View {...props} />;
  Image.displayName = "ExpoImage";
  Image.prefetch = jest.fn();
  return { Image };
});

jest.mock("react-native-avoid-softinput", () => {
  const React = require("react");
  const { View } = require("react-native");
  const AvoidSoftInputView = (props) => (
    <View {...props}>{props.children}</View>
  );
  AvoidSoftInputView.displayName = "AvoidSoftInputView";
  return { AvoidSoftInputView };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("moti", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MotiView = (props) => <View {...props} />;
  MotiView.displayName = "MotiView";
  return { MotiView };
});

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Svg = (props) => <View {...props} />;
  Svg.displayName = "Svg";
  const Path = (props) => <View {...props} />;
  Path.displayName = "Path";
  const DefaultSvg = (props) => <View {...props} />;
  DefaultSvg.displayName = "DefaultSvg";
  return {
    __esModule: true,
    default: DefaultSvg,
    Svg,
    Path,
  };
});

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  const useSharedValue = (value) => ({ value });
  const useDerivedValue = (fn) => ({ value: fn() });
  const useAnimatedStyle = (fn) => fn();
  const withTiming = (value) => value;
  return {
    __esModule: true,
    default: { View },
    useSharedValue,
    useDerivedValue,
    useAnimatedStyle,
    withTiming,
  };
});

jest.mock("@dev-plugins/react-query", () => ({
  useReactQueryDevTools: jest.fn(),
}));

jest.mock("sonner-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Toaster = (props) => <View {...props} />;
  Toaster.displayName = "Toaster";
  return {
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      custom: jest.fn(),
      dismiss: jest.fn(),
    },
    Toaster,
  };
});

jest.mock("@/store/utility", () => ({
  useUtility: () => ({ sizeScale: 1 }),
}));

jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => "mock-uuid"),
}));

jest.mock("expo-localization", () => ({
  getLocales: jest.fn(() => [{ languageCode: "en" }]),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: { extra: {} },
  },
}));

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
    trim: jest.fn(),
  })),
  useMMKVString: jest.fn(() => [undefined, jest.fn()]),
}));
