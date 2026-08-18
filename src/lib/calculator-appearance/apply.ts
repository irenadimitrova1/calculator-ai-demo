import { DEFAULT_SKIN, isValidSkinId } from './constants'
import type { AppearancePreferenceV1 } from './types'

export function applyAppearanceToDocument(
  preference: Pick<AppearancePreferenceV1, 'colorScheme' | 'skin'>,
): void {
  const root = document.documentElement
  root.classList.toggle('dark', preference.colorScheme === 'dark')
  root.dataset.skin = isValidSkinId(preference.skin) ? preference.skin : DEFAULT_SKIN
}
