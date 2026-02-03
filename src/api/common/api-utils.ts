import type { GetNextPageParamFunction, GetPreviousPageParamFunction } from "@tanstack/react-query";
import { PaginateQuery } from ".";

type KeyParams = {
  [key: string]: any;
};
export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// Usage samples:
// const items = normalizePages(data?.pages);
// const nextParam = getNextPageParam(data?.pages?.[data.pages.length - 1]);
// const previousParam = getPreviousPageParam(data?.pages?.[0]);

// for infinite query pages  to flatList data
export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages ? pages.reduce((prev: T[], current) => [...prev, ...current.results], []) : [];
}

// a function that accept a url and return params as an object
export function getUrlParameters(url: string | null): Record<string, string> | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url, "http://placeholder.local");
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    const queryIndex = url.indexOf("?");
    if (queryIndex < 0) {
      return {};
    }
    const searchParams = new URLSearchParams(url.slice(queryIndex + 1));
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
}

// Usage samples:
// const params = getUrlParameters("https://api.example.com/users?offset=20&limit=10");
// const offset = params?.offset;

type PaginationDirection = "next" | "previous";

const NEXT_PARAM_KEYS = ["offset", "page", "cursor", "pageToken", "page_token", "after", "next_cursor", "nextCursor"];
const PREVIOUS_PARAM_KEYS = ["offset", "page", "cursor", "pageToken", "page_token", "before", "prev_cursor", "prevCursor"];

const SECONDARY_NEXT_KEYS = ["nextPage", "next_page", "nextCursor", "next_cursor"];
const SECONDARY_PREVIOUS_KEYS = ["prevPage", "prev_page", "previousPage", "previous_page", "prevCursor", "prev_cursor"];

function coerceParamValue(value: unknown): string | number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) && String(numeric) === trimmed ? numeric : trimmed;
  }
  return null;
}

function getParamFromParams(params: Record<string, string>, keys: string[]): string | number | null {
  for (const key of keys) {
    if (params[key] !== undefined) {
      return coerceParamValue(params[key]);
    }
  }
  return null;
}

function extractParamFromValue(value: unknown, keys: string[]): string | number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" || typeof value === "string") {
    if (typeof value === "string") {
      const params = getUrlParameters(value);
      const fromParams = params ? getParamFromParams(params, keys) : null;
      if (fromParams !== null) {
        return fromParams;
      }
    }
    return coerceParamValue(value);
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of keys) {
      if (obj[key] !== undefined) {
        const result = extractParamFromValue(obj[key], keys);
        if (result !== null) {
          return result;
        }
      }
    }
    for (const linkKey of ["url", "href", "link"]) {
      if (obj[linkKey] !== undefined) {
        const result = extractParamFromValue(obj[linkKey], keys);
        if (result !== null) {
          return result;
        }
      }
    }
  }
  return null;
}

function getPaginationParam(page: unknown, direction: PaginationDirection): string | number | null {
  const record = page as Record<string, unknown>;
  const keys = direction === "next" ? NEXT_PARAM_KEYS : PREVIOUS_PARAM_KEYS;
  const secondaryKeys = direction === "next" ? SECONDARY_NEXT_KEYS : SECONDARY_PREVIOUS_KEYS;
  const directValue = record?.[direction];
  const candidates: unknown[] = [directValue];
  for (const key of secondaryKeys) {
    if (record?.[key] !== undefined) {
      candidates.push(record[key]);
    }
  }
  if (record?.pagination) {
    candidates.push(record.pagination);
  }
  if (record?.links) {
    const links = record.links as Record<string, unknown>;
    const linkKey = direction === "next" ? "next" : "prev";
    if (links?.[linkKey] !== undefined) {
      candidates.push(links[linkKey]);
    }
    if (direction === "previous" && links?.previous !== undefined) {
      candidates.push(links.previous);
    }
  }
  for (const candidate of candidates) {
    const result = extractParamFromValue(candidate, keys);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

export const getPreviousPageParam: GetNextPageParamFunction<unknown, PaginateQuery<unknown>> = (page) => getPaginationParam(page, "previous");

export const getNextPageParam: GetPreviousPageParamFunction<unknown, PaginateQuery<unknown>> = (page) => getPaginationParam(page, "next");
