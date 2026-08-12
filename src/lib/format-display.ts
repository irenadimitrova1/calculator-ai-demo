const MAX_VISIBLE_LENGTH = 12

export function formatDisplay(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  const normalized = Number(parseFloat(value.toPrecision(12)))

  const str = Number.isInteger(normalized)
    ? String(normalized)
    : trimTrailingZeros(String(normalized))

  if (str.length > MAX_VISIBLE_LENGTH) {
    return str.slice(0, MAX_VISIBLE_LENGTH)
  }

  return str
}

function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) {
    return value
  }
  return value
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '')
    .replace(/\.$/, '')
}
