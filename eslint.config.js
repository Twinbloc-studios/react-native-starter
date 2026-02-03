// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },
    rules: {
      "import/no-unresolved": ["error", { ignore: ["^@expo-google-fonts/"] }],
    },
  },
  {
    files: ["**/__tests__/**", "**/*.test.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["src/lib/utils/blurhash.ts"],
    rules: {
      "import/no-unresolved": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["src/lib/i18n/index.tsx"],
    rules: {
      "import/no-named-as-default-member": "off",
    },
  },
]);
