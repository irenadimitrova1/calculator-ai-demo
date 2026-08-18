import { useCallback, useEffect, useState } from 'react'

import {
  applyAppearanceToDocument,
  loadAppearance,
  saveAppearance,
  type AppearancePreferenceV1,
  type ColorScheme,
  type SkinId,
} from '@/lib/calculator-appearance'

export function useAppearancePreferences() {
  const [preference, setPreference] = useState<AppearancePreferenceV1>(loadAppearance)

  useEffect(() => {
    applyAppearanceToDocument(loadAppearance())
  }, [])

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setPreference((current) => {
      const next = { ...current, colorScheme }
      applyAppearanceToDocument(next)
      saveAppearance(next)
      return next
    })
  }, [])

  const setSkin = useCallback((skin: SkinId) => {
    setPreference((current) => {
      const next = { ...current, skin }
      applyAppearanceToDocument(next)
      saveAppearance(next)
      return next
    })
  }, [])

  return {
    colorScheme: preference.colorScheme,
    skin: preference.skin,
    setColorScheme,
    setSkin,
  }
}
