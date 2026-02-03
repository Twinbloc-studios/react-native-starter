module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx,js,jsx}", "<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx}"],
  moduleNameMapper: {
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@env$": "<rootDir>/src/lib/env.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@expo(nent)?/.*|expo(nent)?|expo-router|expo-modules-core|react-native-svg|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context)/)",
  ],
};
