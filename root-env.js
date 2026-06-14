const { z } = require('zod');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

const rootPackageJSON = require('./package.json');

const APP_ENV = process.env.APP_ENV ?? 'development';
const envPath = path.resolve(process.cwd(), `.env.${APP_ENV}`);
const fallbackEnvPath = path.resolve(process.cwd(), '.env');
const resolvedEnvPath = fs.existsSync(envPath) ? envPath : fallbackEnvPath;

dotenv.config({ path: resolvedEnvPath });

const NAME = process.env.APP_NAME ?? 'react-native-starter';
const SLUG = process.env.APP_SLUG ?? 'react-native-starter';
const SCHEME = process.env.APP_SCHEME ?? 'reactnativestarter';

const bundleIdByEnv = {
  development:
    process.env.APP_BUNDLE_ID_DEVELOPMENT ??
    'com.development.reactnativestarter',
  staging:
    process.env.APP_BUNDLE_ID_STAGING ?? 'com.staging.reactnativestarter',
  production: process.env.APP_BUNDLE_ID_PRODUCTION ?? 'com.reactnativestarter',
};

const packageByEnv = {
  development:
    process.env.APP_PACKAGE_DEVELOPMENT ?? 'com.development.reactnativestarter',
  staging: process.env.APP_PACKAGE_STAGING ?? 'com.staging.reactnativestarter',
  production: process.env.APP_PACKAGE_PRODUCTION ?? 'com.reactnativestarter',
};

const BUNDLE_ID = bundleIdByEnv[APP_ENV];
const PACKAGE = packageByEnv[APP_ENV];

const withEnvSuffix = (name) => {
  if (APP_ENV === 'development') {
    return name;
  }

  if (APP_ENV === 'production') {
    return name.replace('.development', '');
  }

  return `${name}.${APP_ENV}`;
};

const bundleIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/);

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/);

const schemeSchema = z
  .string()
  .min(1)
  .regex(/^[a-z][a-z0-9+.-]*$/);

const client = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  NAME: z.string().min(1),
  SLUG: slugSchema,
  SCHEME: schemeSchema,
  BUNDLE_ID: bundleIdSchema,
  PACKAGE: bundleIdSchema,
  VERSION: z.string().min(1),
  EXPO_PUBLIC_API_URL: z.url(),
});

const buildTime = z.object({
  EXPO_ACCOUNT_OWNER: z.string().min(1).optional(),
  EAS_PROJECT_ID: z.string().min(1).optional(),
  SECRET_KEY: z.string().min(1).optional(),
  SLUG: slugSchema,
});

const _clientEnv = {
  APP_ENV,
  NAME,
  SLUG,
  SCHEME,
  BUNDLE_ID,
  PACKAGE,
  VERSION: rootPackageJSON.version,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
};

const _buildTimeEnv = {
  EXPO_ACCOUNT_OWNER: process.env.EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
  SECRET_KEY: process.env.SECRET_KEY,
  SLUG,
};

const _env = {
  ..._clientEnv,
  ..._buildTimeEnv,
};

const merged = buildTime.merge(client);
const parsed = merged.safeParse(_env);

if (parsed.success === false) {
  console.error(
    '❌ Invalid environment variables:',
    z.treeifyError(parsed.error),
    `\n❌ Missing variables in ${path.basename(resolvedEnvPath)}, make sure all required variables are defined.`,
    `\n💡 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -c flag to clear the cache.`,
  );
  throw new Error(
    'Invalid environment variables, Check terminal for more details ',
  );
}

const Env = parsed.data;
const ClientEnv = client.parse(_clientEnv);

module.exports = {
  Env,
  ClientEnv,
  withEnvSuffix,
};
