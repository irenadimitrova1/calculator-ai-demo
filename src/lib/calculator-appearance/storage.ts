import { DEFAULT_SKIN, isValidSkinId, STORAGE_KEY } from './constants'
import type { AppearancePreferenceV1, ColorScheme } from './types'
import { APPEARANCE_VERSION } from './types'

export { STORAGE_KEY }

export function resolveSystemColorScheme(): ColorScheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveDefaults(): AppearancePreferenceV1 {
  return {
    version: APPEARANCE_VERSION,
    colorScheme: resolveSystemColorScheme(),
    skin: DEFAULT_SKIN,
  }
}

function normalizeSkin(skin: string): AppearancePreferenceV1['skin'] {
  return isValidSkinId(skin) ? skin : DEFAULT_SKIN
}

function normalizeColorScheme(value: unknown): ColorScheme {
  return value === 'dark' ? 'dark' : 'light'
}

export function parseAppearanceJson(raw: string): AppearancePreferenceV1 | null {
  try {
    const data = JSON.parse(raw) as unknown
    if (typeof data !== 'object' || data === null) {
      return null
    }

    const record = data as Record<string, unknown>
    if (record.version !== APPEARANCE_VERSION) {
      return null
    }

    if (record.colorScheme !== 'light' && record.colorScheme !== 'dark') {
      return null
    }

    if (typeof record.skin !== 'string') {
      return null
    }

    return {
      version: APPEARANCE_VERSION,
      colorScheme: normalizeColorScheme(record.colorScheme),
      skin: normalizeSkin(record.skin),
    }
  } catch {
    return null
  }
}

export function loadAppearance(): AppearancePreferenceV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return resolveDefaults()
    }

    const parsed = parseAppearanceJson(raw)
    return parsed ?? resolveDefaults()
  } catch {
    return resolveDefaults()
  }
}

export function saveAppearance(preference: AppearancePreferenceV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference))
  } catch {
    // Session-only degrade — storage unavailable
  }
}
