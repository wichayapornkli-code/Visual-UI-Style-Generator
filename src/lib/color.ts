/** Convert a #rrggbb (or #rgb) hex string + alpha to an rgba() string. */
export function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  const a = Math.round(clamp01(alpha) * 1000) / 1000
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const int = parseInt(h || '000000', 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}

export function round(n: number, places = 2): number {
  const f = 10 ** places
  return Math.round(n * f) / f
}
