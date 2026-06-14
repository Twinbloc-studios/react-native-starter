# Twinbloc React Native Starter 👋

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2056-black?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Twinbloc is a comprehensive, production-ready React Native starter kit engineered with **Expo SDK 56**, **TypeScript**, and **UniWind**. It provides a robust, type-safe foundation for building high-performance mobile applications with a modern developer experience.

For full documentation, visit [rn-starter.twinbloc.org](https://rn-starter.twinbloc.org).

## 🚀 Features

- **End-to-End Type Safety**: Built with TypeScript strict mode and Zod for runtime schema validation.
- **Modern Styling**: [UniWind](https://docs.uniwind.dev/) (Universal Tailwind) with Tailwind CSS v4 and Tailwind Variants for consistent, responsive UI across platforms.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for global state (with MMKV persistence & selector helpers) and [TanStack Query](https://tanstack.com/query/latest) for server state (with MMKV persistence).
- **Fast Encrypted Storage**: [MMKV](https://github.com/morousg/react-native-mmkv) with automatic encryption key management via Expo Secure Store.
- **File-based Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) v6 with typed routes enabled and React Compiler support.
- **Authentication Flow**: Zustand auth store with secure token storage, auto 401 sign-out, and persistence across launches.
- **Performance Optimized**: Includes [FlashList](https://shopify.github.io/flash-list/), [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/), [Moti](https://moti.fyi/), and React Compiler.
- **Internationalization**: Full i18n with [i18next](https://www.i18next.com/), 4 locales (en, ar, es, fr), RTL support, and language persistence.
- **E2E Testing**: Pre-configured with [Maestro](https://maestro.mobile.dev/) for mobile UI testing.
- **CI/CD Ready**: GitHub Actions for lint, typecheck, test, CodeQL security analysis, commitlint, dependency review, Expo doctor, auto-labeling, and release drafting.
- **Developer Experience**: Pre-configured with Husky, lint-staged, Commitlint (conventional commits), ESLint (15+ plugins including unicorn, promise, TanStack Query, Tailwind, a11y), Prettier, and VS Code/Cursor snippets.
- **Agent Skills**: Includes [vercel-react-native-skills](./agent-skills/) and [vercel-composition-patterns](./agent-skills/) for AI-assisted development with Cursor, Claude, Trae, and other agents.

## 🛠 Technology Stack

| Category          | Tools                                                                                                                                                                         |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**          | Expo SDK 56, React Native 0.85.3, React 19.2.3                                                                                                                                |
| **Navigation**    | Expo Router v6 (file-based, typed routes)                                                                                                                                     |
| **Styling**       | UniWind, Tailwind CSS v4, Tailwind Variants, Lucide Icons                                                                                                                     |
| **UI Components** | Accordion, Avatar, Bottom Sheet, Button, Checkbox, Container, Icon, Image, Input, InputView, ProgressBar, Radio, SafeFastImage, Select, Separator, Stacks, Switch, Text, View |
| **UI Utilities**  | Goey Native Toast, True Sheet, Confirm Dialog                                                                                                                                 |
| **Data Fetching** | TanStack Query v5 (persisted to MMKV), Axios, react-query-kit                                                                                                                 |
| **Forms**         | React Hook Form, Zod                                                                                                                                                          |
| **State**         | Zustand v5 (with MMKV persistence middleware & selector helpers)                                                                                                              |
| **Storage**       | MMKV (encrypted), Expo Secure Store                                                                                                                                           |
| **Animation**     | Reanimated 4, Moti                                                                                                                                                            |
| **i18n**          | i18next, react-i18next, expo-localization                                                                                                                                     |
| **Testing**       | Jest (jest-expo), @testing-library/react-native, Maestro E2E                                                                                                                  |
| **CI/CD**         | GitHub Actions, Dependabot                                                                                                                                                    |
| **Code Quality**  | ESLint (15+ plugins), Prettier, Husky, lint-staged, Commitlint (conventional commits)                                                                                         |
| **Build**         | EAS Build (development, preview, production)                                                                                                                                  |

## 📥 Installation & Setup

### Requirements

- [Node.js LTS](https://nodejs.org/) (v22 recommended)
- [pnpm](https://pnpm.io/) v11+ (Recommended)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) (for iOS/Android)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for cloud builds)

### 1. Initialize Project

Run the interactive CLI to create your project:

```bash
npx create-twinbloc-app@latest
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Create your environment files:

```bash
cp .env.development .env.local
```

Edit `.env.local` (or `.env.staging`, `.env.production`) with your values:

```bash
EXPO_PUBLIC_API_URL=https://api.example.com
APP_NAME="My App"
```

### 4. Run the App

Since this template uses native modules (MMKV, SecureStore, Gesture Handler, etc.), it requires a **Development Build**.

```bash
# Run on iOS
pnpm ios

# Run on iOS device
pnpm ios:device

# Run on Android
pnpm android

# Run on Web
pnpm web
```

### 5. Generate Native Directories (Optional)

If you need to modify native code directly:

```bash
pnpm prebuild
```

## 📂 Project Structure

```text
├── .github/                    # GitHub config: Actions, Dependabot, release-drafter, labeler
│   └── workflows/              # CI: lint, typecheck, test, CodeQL, commitlint, etc.
├── .husky/                     # Git hooks: pre-commit (lint-staged), commit-msg (commitlint)
├── .maestro/                   # Maestro E2E test flows
├── .vscode/                    # VS Code settings, extensions, snippets
├── agent-skills/               # AI agent skills (Cursor, Claude, Trae, etc.)
│   └── .cursor/.claude/.trae/.agent/
│       ├── vercel-react-native-skills/   # Performance & RN best practices rules
│       └── vercel-composition-patterns/ # Component architecture patterns
├── assets/
│   └── images/                 # App icons, splash, onboarding illustrations
├── src/
│   ├── api/                    # API layer
│   │   ├── common/             # API provider, Axios client, pagination utilities, types
│   │   └── user/               # Example: getUser hook + types
│   ├── app/                    # Expo Router file-based navigation
│   │   ├── (main)/             # Main tab group (redirects to onboarding if first time)
│   │   │   ├── _layout.tsx     # Auth/onboarding gate
│   │   │   └── index.tsx       # Home screen
│   │   ├── +html.tsx           # Web HTML shell
│   │   ├── [...messing].tsx    # 404 catch-all
│   │   ├── _layout.tsx         # Root layout (providers, splash screen, init)
│   │   └── onboarding.tsx      # Onboarding screen (first-launch only)
│   ├── components/
│   │   ├── providers/          # App-wide providers (gesture, i18n, API/query, sheet, toast)
│   │   ├── ui/                 # UI primitives & shared components
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── bottom-sheet.tsx
│   │   │   ├── button.tsx
│   │   │   ├── check-box.tsx
│   │   │   ├── container.tsx  # Includes Container.Insets for safe area
│   │   │   ├── icon.tsx
│   │   │   ├── image.tsx
│   │   │   ├── input.tsx
│   │   │   ├── input-view.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   ├── radio.tsx
│   │   │   ├── safe-fast-image.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── stacks.tsx      # HStack, VStack, ZStack layout primitives
│   │   │   ├── switch.tsx
│   │   │   ├── text.tsx        # Inter font family mappings
│   │   │   ├── toggle-shared.tsx
│   │   │   └── view.tsx
│   │   └── utilities/
│   │       ├── colors.js       # Extended color palette (primary, charcoal, etc.)
│   │       ├── confirm-dialog.tsx
│   │       ├── show-toast.ts
│   │       └── ui-utils.tsx
│   ├── hooks/
│   │   └── general/
│   │       ├── use-countdown.ts
│   │       ├── use-debounce.ts
│   │       ├── use-is-first-time.ts
│   │       ├── use-selected-theme.ts  # Light/dark/system theme switching
│   │       └── use-theme.ts           # Resolved theme object with colors
│   ├── lib/
│   │   ├── i18n/               # Internationalization
│   │   │   ├── index.tsx       # initI18n – RTL, locale detection, MMKV persistence
│   │   │   ├── resources.ts    # i18n resource definitions
│   │   │   ├── utils.tsx       # translate() shorthand helper
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   ├── blurhash.ts     # Image placeholder blurring
│   │   │   ├── delay.ts        # Async delay utility
│   │   │   ├── extract-error.ts # Safe error message extraction
│   │   │   ├── format-currency.ts
│   │   │   ├── rate-app.ts     # In-app review prompt
│   │   │   ├── secure-store.ts # Expo Secure Store wrapper (web fallback)
│   │   │   ├── storage.ts      # MMKV instance with encryption, async init
│   │   │   └── toast-config.ts # Global toast defaults
│   │   ├── app-initializer.ts  # Boot sequence: fonts, storage, i18n
│   │   └── env.ts              # Typed client env access via @env
│   ├── store/
│   │   ├── auth/               # Auth store (Zustand + SecureStore persistence)
│   │   │   ├── index.ts        # signIn, signOut, hydrate, accessToken, auth status
│   │   │   └── utils.ts        # Token secure storage, AuthType, STORAGE_KEY enum
│   │   ├── utility/            # Utility store (haptic feedback, size scale)
│   │   │   └── index.ts
│   │   └── store-utils.ts      # createSelectors helper (useAuth.use.isAuthenticated pattern)
│   ├── translations/           # i18n locale files
│   │   ├── ar.json             # Arabic
│   │   ├── en.json             # English
│   │   ├── es.json             # Spanish
│   │   └── fr.json             # French
│   ├── types/                  # Global TypeScript declarations
│   │   ├── css.d.ts
│   │   ├── eslint-plugins.d.ts
│   │   └── expo-asset.d.ts
│   └── global.css              # Tailwind CSS entry point
├── app.config.ts               # Expo config (env-driven, plugins, experiments)
├── eas.json                    # EAS Build profiles (dev, preview, production)
├── root-env.js                 # Zod-validated environment schema (app & build-time)
├── src/lib/env.ts              # Runtime env access for client code
└── ...
```

## ⚙️ Configuration

### Environment Variables

The project uses Zod-validated environment variables via `root-env.js`. Variables are loaded from `.env.{APP_ENV}` files.

#### Client-Side Variables (bundled in app)

| Variable              | Required | Description                                         | Default                  |
| :-------------------- | -------: | :-------------------------------------------------- | :----------------------- |
| `EXPO_PUBLIC_API_URL` |      Yes | Base URL for API requests                           | —                        |
| `APP_NAME`            |       No | Display name of the app                             | `"react-native-starter"` |
| `APP_SLUG`            |       No | URL-friendly app identifier                         | `"react-native-starter"` |
| `APP_SCHEME`          |       No | Deep link URL scheme                                | `"reactnativestarter"`   |
| `APP_ENV`             |       No | Environment: `development`, `staging`, `production` | `"development"`          |

#### Build-Time / Server-Side Variables

| Variable             | Required | Description                               |
| :------------------- | -------: | :---------------------------------------- |
| `EAS_PROJECT_ID`     |       No | EAS project identifier for cloud builds   |
| `EXPO_ACCOUNT_OWNER` |       No | Expo account owner username               |
| `SECRET_KEY`         |       No | Secret key for any server-side operations |

#### Environment-Specific Bundle IDs / Packages

Configure separate bundle identifiers per environment:

```bash
# .env.development
APP_BUNDLE_ID_DEVELOPMENT=com.development.reactnativestarter
APP_PACKAGE_DEVELOPMENT=com.development.reactnativestarter

# .env.staging
APP_BUNDLE_ID_STAGING=com.staging.reactnativestarter
APP_PACKAGE_STAGING=com.staging.reactnativestarter

# .env.production
APP_BUNDLE_ID_PRODUCTION=com.reactnativestarter
APP_PACKAGE_PRODUCTION=com.reactnativestarter
```

> **Note**: All `EXPO_PUBLIC_` variables are exposed to client code. Never put secrets in client-side variables.

### Path Aliases

The following path aliases are configured in `tsconfig.json` and `jest.config.js`:

| Alias        | Resolves To      |
| :----------- | :--------------- |
| `@/*`        | `src/*`          |
| `@/assets/*` | `assets/*`       |
| `@env`       | `src/lib/env.ts` |

### EAS Build Profiles

Defined in [eas.json](./eas.json):

| Profile       | Distribution          | Use Case                    |
| :------------ | :-------------------- | :-------------------------- |
| `development` | Internal (dev client) | Local dev & testing         |
| `preview`     | Internal              | QA builds, TestFlight, etc. |
| `production`  | Store                 | App Store / Play Store      |

## 📖 Usage Examples

### Authentication

```tsx
import { useAuth, signOut } from '@/store/auth';

function ProfileScreen() {
  const { auth_data, status } = useAuth();

  if (status === 'authenticated') {
    return (
      <View>
        <Text>Welcome, {auth_data?.userId}</Text>
        <Button onPress={signOut}>Sign Out</Button>
      </View>
    );
  }
  return <Text>Please sign in</Text>;
}
```

### API Calls with Auto 401 Handling

```tsx
import { executeRest } from '@/api/common/execute-client';

// The Axios client automatically:
// - Attaches Bearer token from auth store
// - Signs out & clears cache on 401 responses
// - Throws typed ApiError on failure

const fetchData = async () => {
  try {
    const result = await executeRest<User[]>('/users', 'GET');
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(error.message, error.status);
    }
  }
};
```

### Using TanStack Query

```tsx
import { useGetUser } from '@/api/user';

export function UserProfile() {
  const { data, isLoading } = useGetUser();

  if (isLoading) return <Text>Loading...</Text>;
  return <Text>Hello, {data?.name}!</Text>;
}
```

### TanStack Query Pagination Utilities

```tsx
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import {
  normalizePages,
  getNextPageParam,
  getPreviousPageParam,
  DEFAULT_LIMIT,
} from '@/api/common/api-utils';

// The API layer provides helpers for cursor/offset pagination:
// - normalizePages(): flattens infinite query pages into a flat array
// - getNextPageParam() / getPreviousPageParam(): extracts cursors from responses
```

### Zustand Selectors (No Extra Re-renders)

```tsx
import { useAuth } from '@/store/auth';

// Only re-renders when userId changes, not on every store update
function UserName() {
  const userId = useAuth.use.userId();
  return <Text>{userId}</Text>;
}
```

### Encrypted MMKV Storage

```tsx
import { setItem, getItem, removeItem } from '@/lib/utils/storage';
import { STORAGE_KEY } from '@/store/auth/utils';

// Storage is encrypted with a key stored in SecureStore
await setItem(STORAGE_KEY.TOKEN, { access: '...', refresh: '...' });
const token = await getItem(STORAGE_KEY.TOKEN);
```

### Secure Store for Sensitive Data

```tsx
import { setSecureItem, getSecureItem } from '@/lib/utils/secure-store';

// Uses expo-secure-store on native, localStorage fallback on web
await setSecureItem('api_secret', 'super-secret');
const secret = await getSecureItem('api_secret');
```

### Theme Switching

```tsx
import { useTheme } from '@/hooks/general/use-theme';
import { useSelectedTheme } from '@/hooks/general/use-selected-theme';

function ThemeToggle() {
  const theme = useTheme(); // Returns { dark: boolean, colors: {...} }
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

  return (
    <View>
      <Text style={{ color: theme.colors.text }}>
        Current theme: {selectedTheme}
      </Text>
      <Button onPress={() => setSelectedTheme('dark')}>Dark Mode</Button>
    </View>
  );
}
```

### Internationalization

```tsx
import { useTranslation } from 'react-i18next';
import { translate } from '@/lib/i18n';

// Using react-i18next hook
function Greeting() {
  const { t, i18n } = useTranslation();
  return (
    <View>
      <Text>{t('common.appName')}</Text>
      <Button onPress={() => i18n.changeLanguage('ar')}>العربية</Button>
    </View>
  );
}

// Using shorthand translate function
function QuickTranslate() {
  const appName = translate('common.appName'); // Not reactive
  return <Text>{appName}</Text>;
}
```

**Supported languages**: English (`en`), Arabic (`ar` – with RTL), Spanish (`es`), French (`fr`)

### Using UniWind for Styling

```tsx
import { View, Text, Button } from '@/components/ui';

export function WelcomeCard() {
  return (
    <View className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
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

### Showing Toasts & Confirm Dialogs

```tsx
import { ShowToast, confirmDialog } from '@/components/utilities';

ShowToast.success('Profile Updated', 'Your changes have been saved.');

confirmDialog({
  title: 'Delete Account?',
  description: 'This action cannot be undone.',
  variant: 'destructive',
  confirmLabel: 'Delete',
  onConfirm: async () => {
    await deleteAccount();
  },
  updateOptions: {
    title: 'Account deleted',
    description: 'Your account has been removed.',
  },
});
```

### Custom Hooks

```tsx
import { useDebounce } from '@/hooks/general/use-debounce';
import { useCountdown } from '@/hooks/general/use-countdown';

// Debounced search
const debouncedQuery = useDebounce(searchQuery, 500);

// Countdown timer (e.g., for OTP)
const { timeLeft, start, pause, reset } = useCountdown(60);
```

### Utility Functions

```tsx
import { formatCurrency, extractError, rateApp } from '@/lib/utils';
import { blurhash } from '@/lib/utils/blurhash';

// Currency formatting
const price = formatCurrency(1234.5, 'USD', 'en-US'); // "$1,234.50"

// Safe error extraction
const message = extractError(error); // Returns a readable string

// In-app review prompt
await rateApp();
```

### Accessing Environment Variables

```tsx
import { Env } from '@env';

console.log(Env.EXPO_PUBLIC_API_URL);
console.log(Env.NAME);
console.log(Env.BUNDLE_ID); // Environment-specific
console.log(Env.VERSION);
```

## 📜 Available Scripts

| Command                | Description                                      |
| :--------------------- | :----------------------------------------------- |
| `pnpm start`           | Start Expo dev server                            |
| `pnpm ios`             | Run on iOS simulator (requires dev build)        |
| `pnpm ios:device`      | Run on iOS physical device                       |
| `pnpm android`         | Run on Android emulator (requires dev build)     |
| `pnpm web`             | Start web dev server                             |
| `pnpm prebuild`        | Generate native directories (`ios/`, `android/`) |
| `pnpm doctor`          | Run Expo doctor to diagnose config issues        |
| `pnpm lint`            | Run ESLint on `src/`                             |
| `pnpm lint:fix`        | Run ESLint with auto-fix                         |
| `pnpm typecheck`       | Run TypeScript compiler (no emit)                |
| `pnpm test`            | Run Jest tests                                   |
| `pnpm test:watch`      | Run Jest in watch mode                           |
| `pnpm test:e2e`        | Run Maestro E2E tests                            |
| `pnpm install-maestro` | Install Maestro CLI                              |

## 🧪 Testing

### Unit Tests

Tests are located in `__tests__/` directories alongside source files, using Jest + jest-expo + @testing-library/react-native.

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

Test runner is configured in [jest.config.js](./jest.config.js) with:

- Path alias mapping (`@/` → `src/`)
- Transform ignore patterns for RN ecosystem packages

### E2E Tests

Maestro flows are in [.maestro/](./.maestro/):

```bash
pnpm install-maestro   # First time only
pnpm test:e2e          # Run all Maestro flows
```

## 🔧 Git Hooks & Code Quality

### Pre-commit Hook

Runs [lint-staged](https://github.com/lint-staged/lint-staged) on staged files:

- `*.{js,jsx,ts,tsx}` → ESLint (auto-fix) + Prettier (format)
- `*.{json,md}` → Prettier (format)

### Commit Message Hook

Enforces [Conventional Commits](https://www.conventionalcommits.org/) via [Commitlint](https://commitlint.js.org/):

```
feat: add user profile screen
fix: resolve crash on empty list
docs: update README
```

### ESLint Configuration

The project uses a comprehensive ESLint setup ([eslint.config.js](./eslint.config.js)) with 15+ plugins:

| Plugin                       | Purpose                              |
| :--------------------------- | :----------------------------------- |
| `eslint-config-expo`         | Expo base config                     |
| `@typescript-eslint`         | TypeScript rules                     |
| `@tanstack/query`            | TanStack Query best practices        |
| `eslint-plugin-unicorn`      | Modern JS best practices             |
| `eslint-plugin-promise`      | Promise anti-patterns                |
| `simple-import-sort`         | Auto-sort imports & exports          |
| `unused-imports`             | Remove unused imports                |
| `tailwindcss`                | Tailwind CSS class validation        |
| `tailwind-canonical-classes` | Tailwind v4 canonical class ordering |
| `react-native`               | React Native specific rules          |
| `react-native-a11y`          | Accessibility best practices         |
| `prettier`                   | Prettier integration                 |
| `import`                     | Import resolution & cycle detection  |

### Prettier Configuration

Configured in [.prettierrc](./.prettierrc) with `prettier-plugin-tailwindcss` for automatic class sorting.

## 🏗 Architecture Overview

### Application Boot Flow

1. **Splash Screen** displayed immediately ([src/app/\_layout.tsx](./src/app/_layout.tsx))
2. **App Initialization** (`initApp`): Loads Inter fonts, initializes MMKV storage, initializes i18n
3. **Providers Stack** ([src/components/providers/index.tsx](./src/components/providers/index.tsx)):
   - `GestureHandlerRootView` → Touch/gesture handling
   - `I18nextProvider` → Internationalization
   - `APIProvider` → TanStack Query + MMKV persistence + React Query DevTools
   - `ReanimatedTrueSheetProvider` → Bottom sheet support
   - `Toaster` → Toast notifications
4. **Onboarding Gate** ([src/app/(main)/\_layout.tsx](<./src/app/(main)/_layout.tsx>)): Redirects to `/onboarding` on first launch (MMKV-persisted flag)

### API Layer

- **Axios client** ([src/api/common/execute-client.ts](./src/api/common/execute-client.ts)) with auto Bearer token injection
- Auto sign-out on 401 responses
- Typed `ApiError` class for consistent error handling
- **TanStack Query persistence** via MMKV (`@tanstack/react-query-persist-client`)
- **Pagination utilities** ([src/api/common/api-utils.ts](./src/api/common/api-utils.ts)) for cursor/offset-based infinite queries

### Data Flow

```
View → Hook/Store → API Client → Backend
  ↑         ↑           ↑
  │         │           └── Axios + auto auth + 401 handling
  │         └── Zustand (MMKV persisted) / TanStack Query
  └── UniWind styled components (Tailwind CSS)
```

### Storage Strategy

| Storage           | Backend                                                               | Use Case                          |
| :---------------- | :-------------------------------------------------------------------- | :-------------------------------- |
| MMKV (encrypted)  | Zustand persistence, TanStack Query cache, utility prefs, i18n locale | High-performance persistent state |
| Expo Secure Store | Auth tokens, encryption keys                                          | Sensitive data                    |

MMKV encryption keys are automatically generated and stored in Secure Store on first launch.

## 🤖 Agent Skills

The project includes AI-powered agent skills for Cursor, Claude, Trae, and other AI coding assistants:

- **vercel-react-native-skills**: Performance patterns, animation best practices, list optimization, styling rules, React Compiler guidance
- **vercel-composition-patterns**: Compound components, state management patterns, avoiding boolean props, explicit variants

These skills are automatically loaded when using supported AI editors. See [agent-skills/](./agent-skills/) for details.

## 📖 Documentation

For more detailed information, guides, and API references, please visit our official documentation website:

👉 **[rn-starter.twinbloc.org](https://rn-starter.twinbloc.org)**

## 🛠 Troubleshooting

- **Native Module Issues**: If iOS builds fail after adding a library, try:
  ```bash
  cd ios && pod deintegrate && pod install && cd ..
  ```
- **Stale Cache**: Clear Metro bundler cache:
  ```bash
  npx expo start -c
  ```
- **Environment Variables**: Ensure `EXPO_PUBLIC_` prefix is used for client-side variables and restart the server.
- **MMKV Issues**: If storage behaves unexpectedly, you can clear all data:
  ```ts
  import { clearStorage } from '@/lib/utils/storage';
  await clearStorage(); // Full wipe
  ```
- **TypeScript Errors**: After adding new path aliases or dependencies:
  ```bash
  pnpm typecheck
  ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

> **Note**: Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) format (enforced by commitlint).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Twinbloc Studios](https://github.com/Twinbloc-studios)
