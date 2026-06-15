// ── Shared ──────────────────────────────────────────────────────────────────
export type Tab = 'blob' | 'mesh' | 'glass'
export type Device = 'desktop' | 'tablet' | 'mobile'
export type Theme = 'light' | 'dark'

// ── Blob gradient (PRD §5.2) ─────────────────────────────────────────────────
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'lighten'
  | 'color-dodge'
  | 'soft-light'

export interface Blob {
  color: string
  /** position as a percentage of the canvas */
  x: number
  y: number
}

export interface BlobConfig {
  count: number // how many blobs are actually rendered (1..blobs.length)
  size: number // px diameter
  blur: number // px
  opacity: number // 0..1
  blendMode: BlendMode
  animate: boolean
  animSpeed: number // seconds per loop
  animDirection: 'normal' | 'reverse' | 'alternate'
  bgColor: string
  blobs: Blob[]
}

// ── Mesh gradient (PRD §5.3) ─────────────────────────────────────────────────
export interface MeshPoint {
  color: string
  x: number // %
  y: number // %
}

export interface MeshConfig {
  points: MeshPoint[]
  intensity: number // 0..1 — radial-gradient color stop reach
  noise: number // 0..1 — grain opacity
  blur: number // px
  scale: number // 0.5..2 — gradient spread multiplier
  distortion: number // 0..100 — SVG displacement scale
  contrast: number // 0.5..2
  brightness: number // 0.5..2
  grain: boolean
  animate: boolean
  animSpeed: number // seconds
}

// ── Glass surface (PRD §5.4) ─────────────────────────────────────────────────
export type GlassMode = 'frosted' | 'liquid'

export interface GlassConfig {
  mode: GlassMode
  bgColor: string
  bgOpacity: number // 0..1
  blur: number // px
  saturation: number // 1 = 100%
  borderColor: string
  borderOpacity: number // 0..1
  shadowColor: string
  shadowIntensity: number // 0..1 alpha
  shadowSpread: number // px
  shadowBlur: number // px
  highlightOpacity: number // 0..1 inset top edge
  radius: number // px
  padding: number // px
  width: number // px
  height: number // px
  // Liquid-only extras
  refraction: number // 0..100 displacement strength
  specularIntensity: number // 0..1
  glossiness: number // 0..1
  edgeWidth: number // px bright rim
}

// ── Combined design state ────────────────────────────────────────────────────
export interface StyleState {
  blob: BlobConfig
  mesh: MeshConfig
  glass: GlassConfig
}

export interface Preset {
  id: string
  name: string
  state: StyleState
  /** Preferred preview background; applied when the preset is selected. */
  bg?: 'blob' | 'mesh'
}

export interface SavedPreset extends Preset {
  custom: true
}
