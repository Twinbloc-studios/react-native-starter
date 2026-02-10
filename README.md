# Twinbloc React Native Starter 👋

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-black?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Twinbloc is a comprehensive, production-ready React Native starter kit engineered with **Expo SDK 54**, **TypeScript**, and **UniWind**. It provides a robust, type-safe foundation for building high-performance mobile applications with a modern developer experience.

For full documentation, visit [rn-starter.twinbloc.org](https://rn-starter.twinbloc.org).

## 🚀 Features

- **End-to-End Type Safety**: Built with TypeScript and Zod for schema validation.
- **Modern Styling**: [UniWind](https://docs.uniwind.dev/) (Universal Tailwind) for consistent, responsive UI across platforms.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for global state and [TanStack Query](https://tanstack.com/query/latest) for server state.
- **Fast Storage**: [MMKV](https://github.com/morousg/react-native-mmkv) for high-performance key/value storage.
- **File-based Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) for intuitive navigation.
- **Performance Optimized**: Includes [FlashList](https://shopify.github.io/flash-list/), [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/), and [Moti](https://moti.fyi/).
- **Internationalization**: Full i18n support with [i18next](https://www.i18next.com/).
- **E2E Testing**: Pre-configured with [Maestro](https://maestro.mobile.dev/) for mobile UI testing.
- **Developer Experience**: Pre-configured with Husky, Commitlint, Biome/ESLint, and VS Code/Cursor snippets.

## 🛠 Technology Stack

| Category       | Tools                                          |
| :------------- | :--------------------------------------------- |
| **Core**       | Expo SDK 54, React Native 0.81, React 19       |
| **Navigation** | Expo Router v6                                 |
| **Styling**    | UniWind, Tailwind Variants, Lucide Icons       |
| **Data**       | TanStack Query v5, Axios, React Hook Form, Zod |
| **State**      | Zustand                                        |
| **Storage**    | MMKV, Expo Secure Store                        |
| **Animation**  | Reanimated 4, Moti                             |
| **Testing**    | Jest, Maestro E2E                              |

## 📥 Installation & Setup

### Requirements

- [Node.js LTS](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (Recommended)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) (for iOS/Android)

### 1. Initialize Project

Run the interactive CLI to create your project:

```bash
npx create-twinbloc-app@latest
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run the App

Since this template uses native modules, it requires a **Development Build**.

```bash
# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

## 📂 Project Structure

```text
src/
├── api/            # API services and TanStack Query hooks
├── app/            # Expo Router file-based navigation
├── components/     # UI primitives and shared components
├── hooks/          # Custom React hooks (general & feature-specific)
├── lib/            # Utilities, i18n, and environment config
├── store/          # Zustand store definitions
├── translations/   # i18n locale files (en, ar, es, fr)
└── types/          # Global TypeScript declarations
```

## ⚙️ Configuration

### Environment Variables

Configure your environment in `.env.development`, `.env.staging`, or `.env.production`.
All variables are validated in `root-env.js` using Zod.

```bash
# Example .env.development
EXPO_PUBLIC_API_URL=https://api.example.com
APP_NAME="My App (Dev)"
```

## 📖 Usage Examples

### Using TanStack Query

```tsx
import { useGetUser } from "@/api/user";

export function UserProfile() {
  const { data, isLoading } = useGetUser();

  if (isLoading) return <Text>Loading...</Text>;
  return <Text>Hello, {data?.name}!</Text>;
}
```

### Using UniWind for Styling

```tsx
import { View, Text, Button } from "@/components/ui";

export function WelcomeCard() {
  return (
    <View className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
      <Text className="text-xl font-bold text-slate-900 dark:text-white">
        Welcome to Twinbloc
      </Text>
      <Button variant="primary" className="mt-4">
        Get Started
      </Button>
    </View>
  );
}
```

## � Documentation

For more detailed information, guides, and API references, please visit our official documentation website:

👉 **[rn-starter.twinbloc.org](https://rn-starter.twinbloc.org)**

## �🛠 Troubleshooting

- **Native Module Issues**: If iOS builds fail after adding a library, try:
  ```bash
  cd ios && pod deintegrate && pod install && cd ..
  ```
- **Stale Cache**: Clear Metro bundler cache:
  ```bash
  npx expo start -c
  ```
- **Environment Variables**: Ensure `EXPO_PUBLIC_` prefix is used for client-side variables and restart the server.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Twinbloc Studios](https://github.com/Twinbloc-studios)
