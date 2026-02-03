/*
 * Client environment access point.
 * Add variables in root-env.js and expose them through app.config.ts extra.
 * This file is used when importing `Env` from @env.
 * Env is readonly and must not be mutated.
 */

import Constants from "expo-constants";

type ClientEnvType = typeof import("../../root-env.js").ClientEnv;

export const Env = Object.freeze(Constants.expoConfig?.extra ?? {}) as Readonly<ClientEnvType>;
