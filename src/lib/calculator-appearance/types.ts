export const APPEARANCE_VERSION = 1

export type ColorScheme = 'light' | 'dark'

export type SkinId = 'classic' | 'baby-pink' | 'console' | 'retro'

export type AppearancePreferenceV1 = {
  version: typeof APPEARANCE_VERSION
  colorScheme: ColorScheme
  skin: SkinId
}
