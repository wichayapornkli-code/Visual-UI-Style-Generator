import type { BlobConfig, GlassConfig, MeshConfig, StyleState } from './types'

// Defaults extracted from the mTel brand (mtel_internal_web/styles/globals.css):
// warm cream/gold hero palette on a near-white canvas, with a soft frosted glass card.
export const DEFAULT_BLOB: BlobConfig = {
  count: 4,
  size: 520,
  blur: 80,
  opacity: 0.85,
  blendMode: 'normal',
  animate: true,
  animSpeed: 22,
  animDirection: 'alternate',
  bgColor: '#FFFDFB', // warm-50 page canvas
  blobs: [
    { color: '#FFEF40', x: 18, y: 24 }, // ambient highlight
    { color: '#F5C518', x: 78, y: 30 }, // hero gold
    { color: '#FFF9C2', x: 40, y: 72 }, // pale
    { color: '#FF7552', x: 84, y: 78 }, // coral accent
    { color: '#FFFEDA', x: 12, y: 84 }, // cream
  ],
}

export const DEFAULT_MESH: MeshConfig = {
  points: [
    { color: '#FFFEDA', x: 14, y: 16 },
    { color: '#F5C518', x: 84, y: 14 },
    { color: '#FFF9C2', x: 26, y: 82 },
    { color: '#FF7552', x: 80, y: 86 },
  ],
  intensity: 0.6,
  noise: 0.05,
  blur: 40,
  scale: 1,
  distortion: 0,
  contrast: 1,
  brightness: 1.02,
  grain: true,
  animate: false,
  animSpeed: 22,
}

export const DEFAULT_GLASS: GlassConfig = {
  mode: 'frosted',
  bgColor: '#FFFFFF',
  bgOpacity: 0.42, // --homepage-glass-bg-hero (surface 42%)
  blur: 22, // --glass-blur-md
  saturation: 1.3,
  borderColor: '#FFFFFF',
  borderOpacity: 0.5,
  shadowColor: '#1A1A4E', // navy brand tint
  shadowIntensity: 0.12,
  shadowSpread: 0,
  shadowBlur: 40,
  highlightOpacity: 0.6,
  radius: 24, // --radius-xl
  padding: 28,
  width: 360,
  height: 220,
  refraction: 40,
  specularIntensity: 0.6,
  glossiness: 0.5,
  edgeWidth: 1.5,
}

export const DEFAULT_STATE: StyleState = {
  blob: DEFAULT_BLOB,
  mesh: DEFAULT_MESH,
  glass: DEFAULT_GLASS,
}

/** Deep clone so callers never share nested arrays/objects with the defaults. */
export function cloneState<T>(s: T): T {
  return structuredClone(s)
}
