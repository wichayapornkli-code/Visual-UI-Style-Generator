import type { StyleState } from '../types'
import { round } from '../lib/color'

/**
 * A self-contained natural-language prompt an LLM can act on to recreate the
 * current style as CSS. Built from live state so it always matches the preview.
 */
export function toPrompt(state: StyleState): string {
  const { blob, mesh, glass } = state
  const blobColors = blob.blobs.slice(0, blob.count).map((b) => b.color).join(', ')
  const meshColors = mesh.points.map((p) => p.color).join(', ')

  const blobLine = `a soft blob gradient on a ${blob.bgColor} canvas with ${blob.count} blurred blobs (${blobColors}) at ${blob.blur}px blur, ${round(
    blob.opacity,
  )} opacity, ${blob.blendMode} blend${blob.animate ? `, gently animated over ${blob.animSpeed}s` : ''}`

  const meshLine = `a mesh gradient blending the colors ${meshColors} at ${round(
    mesh.intensity,
  )} intensity with ${mesh.blur}px blur${mesh.grain ? ` and subtle grain (${round(mesh.noise)})` : ''}`

  const glassLine =
    glass.mode === 'liquid'
      ? `an iOS-style liquid-glass card: ${glass.bgColor} fill at ${round(
          glass.bgOpacity,
        )} opacity, ${glass.blur}px backdrop blur, ${round(
          glass.saturation * 100,
        )}% saturation, a ${round(glass.borderOpacity)}-opacity border, ${glass.radius}px radius, edge refraction ~${glass.refraction}, a specular rim and a glossy convex highlight`
      : `a frosted glass card: ${glass.bgColor} fill at ${round(
          glass.bgOpacity,
        )} opacity, ${glass.blur}px backdrop blur, ${round(
          glass.saturation * 100,
        )}% saturation, a 1px ${glass.borderColor} border at ${round(
          glass.borderOpacity,
        )} opacity, ${glass.radius}px corner radius, and a soft ${glass.shadowColor} drop shadow (${glass.shadowBlur}px)`

  return `Recreate this UI visual style as production CSS.

Background: ${blobLine}. (Alternatively, ${meshLine}.)

Foreground card: ${glassLine}.

Keep the look modern, soft, and premium. Output the CSS for the background and the card.`
}
