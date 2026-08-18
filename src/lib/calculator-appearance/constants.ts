import type { SkinId } from './types'

/** Keep in sync with inline boot script in index.html */
export const STORAGE_KEY = 'calculator-appearance'

export const DEFAULT_SKIN: SkinId = 'classic'

export type SkinDefinition = {
  id: SkinId
  label: string
  /** CSS color for swatch preview in the picker */
  swatchColor: string
}

export const SKINS: readonly SkinDefinition[] = [
  { id: 'classic', label: 'Classic', swatchColor: 'oklch(0.45 0 0)' },
  { id: 'baby-pink', label: 'Baby Pink', swatchColor: 'oklch(0.72 0.16 350)' },
  { id: 'console', label: 'Console', swatchColor: 'oklch(0.65 0.18 145)' },
  { id: 'retro', label: 'Retro', swatchColor: 'oklch(0.62 0.12 65)' },
] as const

export const SKIN_IDS: readonly SkinId[] = SKINS.map((skin) => skin.id)

export function isValidSkinId(value: string): value is SkinId {
  return SKIN_IDS.includes(value as SkinId)
}
