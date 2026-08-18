import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  applyAppearanceToDocument,
  APPEARANCE_VERSION,
  DEFAULT_SKIN,
  loadAppearance,
  parseAppearanceJson,
  resolveDefaults,
  saveAppearance,
  STORAGE_KEY,
  type AppearancePreferenceV1,
} from './index'

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
}

describe('calculator appearance', () => {
  let storage: Storage

  beforeEach(() => {
    storage = createLocalStorageMock()
    vi.stubGlobal('localStorage', storage)
    document.documentElement.classList.remove('dark')
    delete document.documentElement.dataset.skin
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.classList.remove('dark')
    delete document.documentElement.dataset.skin
  })

  it('returns OS defaults when storage key is missing', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false }),
    )

    expect(loadAppearance()).toEqual({
      version: APPEARANCE_VERSION,
      colorScheme: 'light',
      skin: DEFAULT_SKIN,
    })
  })

  it('returns dark OS default when prefers-color-scheme is dark', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true }),
    )

    expect(resolveDefaults().colorScheme).toBe('dark')
  })

  it('round-trips valid persisted appearance', () => {
    const preference: AppearancePreferenceV1 = {
      version: APPEARANCE_VERSION,
      colorScheme: 'dark',
      skin: 'console',
    }

    saveAppearance(preference)
    expect(loadAppearance()).toEqual(preference)
  })

  it.each([
  {
    name: 'invalid JSON',
    value: '{not json',
    osDark: false,
    expectedSkin: DEFAULT_SKIN,
  },
  {
    name: 'wrong version',
    value: JSON.stringify({ version: 2, colorScheme: 'dark', skin: 'retro' }),
    osDark: true,
    expectedSkin: DEFAULT_SKIN,
  },
  {
    name: 'invalid color scheme',
    value: JSON.stringify({ version: 1, colorScheme: 'sepia', skin: 'retro' }),
    osDark: false,
    expectedSkin: DEFAULT_SKIN,
  },
  {
    name: 'missing skin',
    value: JSON.stringify({ version: 1, colorScheme: 'light' }),
    osDark: false,
    expectedSkin: DEFAULT_SKIN,
  },
  {
    name: 'unknown skin id',
    value: JSON.stringify({ version: 1, colorScheme: 'light', skin: 'graphite-pro' }),
    osDark: false,
    expectedSkin: DEFAULT_SKIN,
  },
])('falls back for corrupt data: $name', ({ value, osDark, expectedSkin }) => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: osDark }),
    )
    storage.setItem(STORAGE_KEY, value)

    expect(loadAppearance()).toEqual({
      version: APPEARANCE_VERSION,
      colorScheme: osDark ? 'dark' : 'light',
      skin: expectedSkin,
    })
  })

  it('normalizes unknown skin in parseAppearanceJson', () => {
    const parsed = parseAppearanceJson(
      JSON.stringify({ version: 1, colorScheme: 'light', skin: 'unknown' }),
    )

    expect(parsed).toEqual({
      version: APPEARANCE_VERSION,
      colorScheme: 'light',
      skin: DEFAULT_SKIN,
    })
  })

  it.each([
    { colorScheme: 'light' as const, skin: 'baby-pink' as const, dark: false },
    { colorScheme: 'dark' as const, skin: 'retro' as const, dark: true },
  ])(
    'applyAppearanceToDocument sets html class and data-skin for $skin/$colorScheme',
    ({ colorScheme, skin, dark }) => {
      applyAppearanceToDocument({ colorScheme, skin })

      expect(document.documentElement.classList.contains('dark')).toBe(dark)
      expect(document.documentElement.dataset.skin).toBe(skin)
    },
  )

  it('does not throw when localStorage fails on save', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota exceeded')
      },
    })

    expect(() =>
      saveAppearance({
        version: APPEARANCE_VERSION,
        colorScheme: 'light',
        skin: 'classic',
      }),
    ).not.toThrow()
  })
})
