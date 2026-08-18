const STORAGE_KEY = 'calculator-history-panel-visible'

export function loadHistoryPanelVisible(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return true
    }
    return raw === 'true'
  } catch {
    return true
  }
}

export function saveHistoryPanelVisible(visible: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(visible))
  } catch {
    // Session-only degrade — storage unavailable
  }
}
