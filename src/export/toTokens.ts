import type { StyleState } from '../types'
import { generateGlass } from '../generators/glass'
import { rgba, round } from '../lib/color'

/** Design tokens as a JSON-serializable object (PRD §5.7 / §5.4). */
export function toTokens(state: StyleState) {
  const glass = generateGlass(state.glass).tokens
  return {
    blob: {
      background: state.blob.bgColor,
      count: state.blob.count,
      size: `${state.blob.size}px`,
      blur: `${state.blob.blur}px`,
      opacity: round(state.blob.opacity),
      blendMode: state.blob.blendMode,
      colors: state.blob.blobs.slice(0, state.blob.count).map((b) => b.color),
    },
    mesh: {
      colors: state.mesh.points.map((p) => p.color),
      intensity: round(state.mesh.intensity),
      blur: `${state.mesh.blur}px`,
      grain: state.mesh.grain ? round(state.mesh.noise) : 0,
      contrast: round(state.mesh.contrast),
      brightness: round(state.mesh.brightness),
    },
    glass,
    palette: {
      blobBg: state.blob.bgColor,
      glassFill: rgba(state.glass.bgColor, state.glass.bgOpacity),
    },
  }
}

export function tokensJson(state: StyleState): string {
  return JSON.stringify(toTokens(state), null, 2)
}
