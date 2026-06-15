import type { StyleState } from '../types'
import { generateBlob } from '../generators/blob'
import { generateMesh } from '../generators/mesh'
import { generateGlass } from '../generators/glass'
import { tokensJson } from './toTokens'
import { round } from '../lib/color'

/** A readable Markdown spec of the full style — values + CSS + tokens. */
export function toMarkdown(state: StyleState): string {
  const { blob, mesh, glass } = state
  const blobCss = generateBlob(blob).css
  const meshCss = generateMesh(mesh).css
  const glassCss = generateGlass(glass).css

  const blobColors = blob.blobs.slice(0, blob.count).map((b) => b.color).join(', ')
  const meshColors = mesh.points.map((p) => p.color).join(', ')

  return `# UI Style

Generated with the Visual UI Style Generator.

## Blob gradient background

- Background: \`${blob.bgColor}\`
- Blobs (${blob.count}): ${blobColors}
- Size: ${blob.size}px · Blur: ${blob.blur}px · Opacity: ${round(blob.opacity)}
- Blend mode: ${blob.blendMode}
- Animation: ${blob.animate ? `${blob.animSpeed}s ${blob.animDirection}` : 'off'}

\`\`\`css
${blobCss}
\`\`\`

## Mesh gradient background

- Colors: ${meshColors}
- Intensity: ${round(mesh.intensity)} · Blur: ${mesh.blur}px · Scale: ${round(mesh.scale)}×
- Contrast: ${round(mesh.contrast)}× · Brightness: ${round(mesh.brightness)}×
- Grain: ${mesh.grain ? `on (${round(mesh.noise)})` : 'off'} · Distortion: ${mesh.distortion}

\`\`\`css
${meshCss}
\`\`\`

## Glass surface (${glass.mode})

- Fill: \`${glass.bgColor}\` at ${round(glass.bgOpacity)} opacity
- Backdrop blur: ${glass.blur}px · Saturation: ${round(glass.saturation * 100)}%
- Border: \`${glass.borderColor}\` at ${round(glass.borderOpacity)}
- Shadow: \`${glass.shadowColor}\` · blur ${glass.shadowBlur}px · spread ${glass.shadowSpread}px
- Radius: ${glass.radius}px · Padding: ${glass.padding}px${
    glass.mode === 'liquid'
      ? `\n- Liquid: refraction ${glass.refraction} · specular ${round(
          glass.specularIntensity,
        )} · gloss ${round(glass.glossiness)} · edge ${round(glass.edgeWidth)}px`
      : ''
  }

\`\`\`css
${glassCss}
\`\`\`

## Design tokens

\`\`\`json
${tokensJson(state)}
\`\`\`
`
}
