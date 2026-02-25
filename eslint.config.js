// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const tanstackQueryPlugin = require("@tanstack/eslint-plugin-query");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const parser = require("@typescript-eslint/parser");
const expoConfig = require("eslint-config-expo/flat.js");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const promisePlugin = require("eslint-plugin-promise");
const reactNativePlugin = require("eslint-plugin-react-native");
const reactNativeA11yPlugin = require("eslint-plugin-react-native-a11y");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const tailwindcssPlugin = require("eslint-plugin-tailwindcss");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = (async () => {
  const { default: eslintPluginUnicorn } =
    await import("eslint-plugin-unicorn");

  return defineConfig([
    // Base Expo config (includes React, React Hooks, TypeScript, etc.)
    ...(Array.isArray(expoConfig) ? expoConfig : [expoConfig]),

    // Prettier config to disable conflicting rules
    prettierConfig,

    {
      ignores: ["dist/*", ".expo/*", "web-build/*"],

      plugins: {
        "react-native": reactNativePlugin,
        "simple-import-sort": simpleImportSort,
        "unused-imports": unusedImports,
        "@tanstack/query": tanstackQueryPlugin,
        prettier: prettierPlugin,
        unicorn: eslintPluginUnicorn,
        tailwindcss: tailwindcssPlugin,
        "react-native-a11y": reactNativeA11yPlugin,
        promise: promisePlugin,
      },

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
        // --- Complexity & Code Quality ---
        "max-params": ["error", 6],
        "max-lines-per-function": ["error", 300],

        // --- Tailwind CSS ---
        // "tailwindcss/classnames-order": [
        //   "warn",
        //   {
        //     officialSorting: true,
        //   },
        // ],
        "tailwindcss/no-custom-classname": "off",

        // --- React / React Native ---
        "react/display-name": "off",
        "react/no-inline-styles": "off", // User explicitly requested 'off'
        "react-native/no-inline-styles": "off", // Syncing with user intent (was warn)
        "react/destructuring-assignment": "off",
        "react/require-default-props": "off",

        // --- React Native Accessibility ---
        ...reactNativeA11yPlugin.configs.all.rules,

        // React Native specific (keep these if not conflicting with user request)
        "react-native/no-unused-styles": "error",
        "react-native/split-platform-components": "error",
        "react-native/no-color-literals": "warn",
        "react-native/no-raw-text": ["warn", { skip: ["CustomText"] }],

        // --- Unicorn (Modern JS Best Practices) ---
        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: [
              "/android",
              "/ios",
              "app.config.ts",
              "babel.config.js",
              "metro.config.js",
              "jest.config.js",
              "eslint.config.js",
              "eslint.config.mjs",
            ],
          },
        ],

        // --- Imports & Sorting ---
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",

        // --- Promise ---
        "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": "error",
        "promise/no-nesting": "warn",
        "promise/no-promise-in-callback": "warn",
        "promise/no-callback-in-promise": "warn",
        "promise/avoid-new": "warn",
        "promise/no-new-statics": "error",
        "promise/no-return-in-finally": "error",
        "promise/valid-params": "error",

        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],

        "import/prefer-default-export": "off",
        "import/no-cycle": ["error", { maxDepth: "∞" }],
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": ["error", { "prefer-inline": true }],
        "import/no-unresolved": ["error", { ignore: ["^@expo-google-fonts/"] }],

        // --- Prettier ---
        "prettier/prettier": [
          0,
          {
            singleQuote: true,
            endOfLine: "auto",
          },
        ],

        // --- TanStack Query ---
        ...tanstackQueryPlugin.configs.recommended.rules,

        // --- TypeScript ---
        "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
      },
    },

    {
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        parser: parser,
        parserOptions: {
          project: "./tsconfig.json",
          sourceType: "module",
        },
      },
      rules: {
        ...typescriptEslintPlugin.configs.recommended.rules,
        "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/consistent-type-imports": [
          "warn",
          {
            prefer: "type-imports",
            fixStyle: "inline-type-imports",
            disallowTypeAnnotations: true,
          },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
      },
    },

    // Overrides
    {
      files: ["**/__tests__/**", "**/*.test.*"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "max-lines-per-function": "off", // Tests can be long
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
    {
      files: ["src/lib/utils/delay.ts"],
      rules: {
        "promise/avoid-new": "off",
      },
    },
    {
      // Allow camelCase for specific configuration files if unicorn complains
      files: [
        "app.config.ts",
        "babel.config.js",
        "metro.config.js",
        "jest.config.js",
        "eslint.config.js",
        "eslint.config.mjs",
      ],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
  ]);
})();
