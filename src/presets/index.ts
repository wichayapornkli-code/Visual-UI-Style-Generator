import type { Preset, StyleState } from '../types'
import { DEFAULT_STATE } from '../defaults'

/** Build a full StyleState by deep-merging overrides onto the defaults. */
function make(over: {
  blob?: Partial<StyleState['blob']>
  mesh?: Partial<StyleState['mesh']>
  glass?: Partial<StyleState['glass']>
}): StyleState {
  const base = structuredClone(DEFAULT_STATE)
  return {
    blob: { ...base.blob, ...over.blob },
    mesh: { ...base.mesh, ...over.mesh },
    glass: { ...base.glass, ...over.glass },
  }
}

export const PRESETS: Preset[] = [
  {
    // Mirrors the app defaults (extracted from the mTel brand) so the chip always
    // restores the boot-time look.
    id: 'mtel-brand',
    name: 'mTel Brand',
    bg: 'blob',
    state: structuredClone(DEFAULT_STATE),
  },
  {
    id: 'aurora',
    name: 'Aurora',
    bg: 'blob',
    state: make({
      blob: {
        bgColor: '#070a18',
        count: 4,
        size: 480,
        blur: 100,
        opacity: 0.65,
        blendMode: 'screen',
        blobs: [
          { color: '#7c5cff', x: 24, y: 28 },
          { color: '#22d3ee', x: 76, y: 26 },
          { color: '#f472b6', x: 38, y: 78 },
          { color: '#a78bfa', x: 82, y: 74 },
          { color: '#5cff9d', x: 12, y: 82 },
        ],
      },
      glass: {
        mode: 'liquid',
        bgOpacity: 0.1,
        blur: 18,
        saturation: 1.8,
        highlightOpacity: 0.55,
        glossiness: 0.6,
        refraction: 46,
        specularIntensity: 0.7,
      },
    }),
  },
  {
    // Stripe — signature "blurple" diagonal mesh.
    id: 'stripe',
    name: 'Stripe',
    bg: 'mesh',
    state: make({
      mesh: {
        points: [
          { color: '#635BFF', x: 10, y: 14 },
          { color: '#00D4FF', x: 88, y: 10 },
          { color: '#FF80B5', x: 22, y: 86 },
          { color: '#7A73FF', x: 82, y: 84 },
        ],
        intensity: 0.7,
        blur: 28,
        grain: false,
        noise: 0,
        brightness: 1.04,
      },
      glass: { bgColor: '#ffffff', bgOpacity: 0.32, blur: 18, borderOpacity: 0.45, radius: 20 },
    }),
  },
  {
    // Tailwind CSS — cool sky/cyan/indigo from the default palette.
    id: 'tailwind-sky',
    name: 'Tailwind Sky',
    bg: 'mesh',
    state: make({
      mesh: {
        points: [
          { color: '#38BDF8', x: 14, y: 16 },
          { color: '#0EA5E9', x: 86, y: 12 },
          { color: '#6366F1', x: 26, y: 84 },
          { color: '#22D3EE', x: 80, y: 88 },
        ],
        intensity: 0.66,
        blur: 30,
        grain: false,
        noise: 0,
      },
      glass: { bgColor: '#ffffff', bgOpacity: 0.34, blur: 16, borderOpacity: 0.5, radius: 18 },
    }),
  },
  {
    // Apple Intelligence — vibrant pink→purple→blue→teal, on liquid glass.
    id: 'apple-intelligence',
    name: 'Apple Intelligence',
    bg: 'mesh',
    state: make({
      mesh: {
        points: [
          { color: '#FF375F', x: 12, y: 18 },
          { color: '#BF5AF2', x: 86, y: 14 },
          { color: '#0A84FF', x: 24, y: 84 },
          { color: '#64D2FF', x: 82, y: 86 },
        ],
        intensity: 0.7,
        blur: 34,
        grain: false,
        noise: 0,
      },
      glass: {
        mode: 'liquid',
        bgColor: '#ffffff',
        bgOpacity: 0.16,
        blur: 20,
        saturation: 1.7,
        borderOpacity: 0.4,
        highlightOpacity: 0.6,
        glossiness: 0.6,
        refraction: 46,
        specularIntensity: 0.7,
        radius: 28,
      },
    }),
  },
  {
    // Figma — playful multicolor brand dots on a dark canvas.
    id: 'figma',
    name: 'Figma',
    bg: 'blob',
    state: make({
      blob: {
        bgColor: '#141414',
        count: 5,
        size: 360,
        blur: 70,
        opacity: 0.85,
        blendMode: 'screen',
        blobs: [
          { color: '#F24E1E', x: 24, y: 26 },
          { color: '#FF7262', x: 70, y: 22 },
          { color: '#A259FF', x: 46, y: 54 },
          { color: '#1ABCFE', x: 28, y: 80 },
          { color: '#0ACF83', x: 80, y: 78 },
        ],
      },
      glass: {
        bgColor: '#ffffff',
        bgOpacity: 0.08,
        blur: 16,
        borderColor: '#ffffff',
        borderOpacity: 0.22,
        shadowIntensity: 0.4,
        highlightOpacity: 0.45,
        radius: 18,
      },
    }),
  },
  {
    // Instagram — the iconic purple→magenta→orange gradient.
    id: 'instagram',
    name: 'Instagram',
    bg: 'mesh',
    state: make({
      mesh: {
        points: [
          { color: '#515BD4', x: 12, y: 16 },
          { color: '#8134AF', x: 30, y: 60 },
          { color: '#DD2A7B', x: 78, y: 30 },
          { color: '#F58529', x: 84, y: 86 },
        ],
        intensity: 0.7,
        blur: 30,
        grain: false,
        noise: 0,
      },
      glass: { bgColor: '#ffffff', bgOpacity: 0.3, blur: 18, borderOpacity: 0.45, radius: 22 },
    }),
  },
  {
    // Linear — pure indigo glow on near-black, subtle liquid glass.
    id: 'linear',
    name: 'Linear',
    bg: 'blob',
    state: make({
      blob: {
        bgColor: '#0B0A1A',
        count: 3,
        size: 460,
        blur: 120,
        opacity: 0.5,
        blendMode: 'screen',
        blobs: [
          { color: '#5E6AD2', x: 28, y: 30 },
          { color: '#7C8AFF', x: 74, y: 34 },
          { color: '#3D2E8C', x: 50, y: 82 },
          { color: '#5E6AD2', x: 85, y: 80 },
          { color: '#7C8AFF', x: 12, y: 82 },
        ],
      },
      glass: {
        mode: 'liquid',
        bgColor: '#12101f',
        bgOpacity: 0.3,
        blur: 24,
        saturation: 1.3,
        borderColor: '#ffffff',
        borderOpacity: 0.14,
        shadowIntensity: 0.55,
        shadowBlur: 60,
        highlightOpacity: 0.35,
        glossiness: 0.4,
        refraction: 34,
        specularIntensity: 0.5,
        radius: 20,
      },
    }),
  },
  {
    // Vercel — monochrome: faint white glows on pure black.
    id: 'vercel',
    name: 'Vercel',
    bg: 'blob',
    state: make({
      blob: {
        bgColor: '#0A0A0A',
        count: 3,
        size: 420,
        blur: 120,
        opacity: 0.6,
        blendMode: 'screen',
        blobs: [
          { color: '#2a2a2a', x: 28, y: 28 },
          { color: '#3a3a3a', x: 72, y: 34 },
          { color: '#1f1f1f', x: 50, y: 82 },
          { color: '#2a2a2a', x: 85, y: 80 },
          { color: '#1a1a1a', x: 12, y: 82 },
        ],
      },
      glass: {
        bgColor: '#ffffff',
        bgOpacity: 0.05,
        blur: 12,
        saturation: 1,
        borderColor: '#ffffff',
        borderOpacity: 0.18,
        shadowIntensity: 0.5,
        shadowBlur: 30,
        highlightOpacity: 0.4,
        radius: 12,
      },
    }),
  },
  {
    id: 'dark-premium-glass',
    name: 'Dark Premium Glass',
    bg: 'blob',
    state: make({
      blob: {
        bgColor: '#05060a',
        count: 3,
        opacity: 0.55,
        size: 420,
        blur: 110,
        blobs: [
          { color: '#1e293b', x: 26, y: 30 },
          { color: '#6d28d9', x: 76, y: 30 },
          { color: '#0e7490', x: 48, y: 80 },
          { color: '#ffd66a', x: 85, y: 80 },
          { color: '#5cff9d', x: 12, y: 82 },
        ],
      },
      glass: {
        mode: 'liquid',
        bgColor: '#0b1120',
        bgOpacity: 0.35,
        blur: 22,
        saturation: 1.4,
        borderColor: '#ffffff',
        borderOpacity: 0.18,
        shadowIntensity: 0.55,
        shadowBlur: 60,
        highlightOpacity: 0.4,
        glossiness: 0.45,
        refraction: 38,
        specularIntensity: 0.55,
        radius: 28,
      },
    }),
  },
  {
    id: 'minimal-frosted',
    name: 'Minimal Frosted Card',
    bg: 'blob',
    state: make({
      blob: { bgColor: '#e9eef5', count: 2, opacity: 0.45, blendMode: 'multiply' },
      glass: {
        bgColor: '#ffffff',
        bgOpacity: 0.4,
        blur: 12,
        saturation: 1.2,
        borderOpacity: 0.5,
        shadowIntensity: 0.15,
        shadowBlur: 24,
        highlightOpacity: 0.7,
        radius: 16,
      },
    }),
  },
]
