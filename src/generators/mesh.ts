import type { CSSProperties } from 'react'
import type { MeshConfig } from '../types'
import { rgba, round } from '../lib/color'

export interface MeshOutput {
  /** Inline style for the mesh background layer in the preview. */
  style: CSSProperties
  /** Optional SVG markup (grain + distortion filter) to render behind the layer. */
  svg: string
  /** Unique id of the distortion filter, or '' when distortion is off. */
  filterId: string
  keyframesCss: string
  css: string
}

const FILTER_ID = 'mesh-distort'

function gradients(cfg: MeshConfig): string[] {
  const reach = round(38 * cfg.intensity * cfg.scale + 10)
  return cfg.points.map(
    (p) =>
      `radial-gradient(circle at ${round(p.x)}% ${round(p.y)}%, ${rgba(
        p.color,
        1,
      )} 0%, ${rgba(p.color, 0)} ${reach}%)`,
  )
}

export function generateMesh(cfg: MeshConfig): MeshOutput {
  const layers = gradients(cfg)
  const baseColor = cfg.points[0]?.color ?? '#101018'
  const bg = `${layers.join(',\n    ')}, ${baseColor}`

  const filterParts = [
    cfg.blur > 0 ? `blur(${cfg.blur}px)` : '',
    cfg.contrast !== 1 ? `contrast(${round(cfg.contrast)})` : '',
    cfg.brightness !== 1 ? `brightness(${round(cfg.brightness)})` : '',
  ].filter(Boolean)

  const useDistort = cfg.distortion > 0
  const filterId = useDistort ? FILTER_ID : ''

  const style: CSSProperties = {
    position: 'absolute',
    inset: `-${cfg.blur * 2}px`, // bleed so blur doesn't show hard edges
    backgroundColor: baseColor,
    backgroundImage: layers.join(', '),
    filter:
      [...filterParts, useDistort ? `url(#${FILTER_ID})` : '']
        .filter(Boolean)
        .join(' ') || undefined,
    animation: cfg.animate
      ? `meshShift ${cfg.animSpeed}s ease-in-out alternate infinite`
      : undefined,
    willChange: cfg.animate ? 'background-position' : undefined,
  }

  // Grain overlay + optional displacement filter as one SVG.
  const grainFilter = `<filter id="mesh-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`
  const distortFilter = useDistort
    ? `<filter id="${FILTER_ID}"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${round(
        cfg.distortion,
      )}" xChannelSelector="R" yChannelSelector="G"/></filter>`
    : ''
  const grainRect = cfg.grain
    ? `<rect width="100%" height="100%" filter="url(#mesh-grain)" opacity="${round(
        cfg.noise,
      )}"/>`
    : ''
  const svg =
    cfg.grain || useDistort
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:overlay">${grainFilter}${distortFilter}${grainRect}</svg>`
      : ''

  const keyframesCss = cfg.animate
    ? `@keyframes meshShift {
  0%   { background-position: 0% 0%; }
  100% { background-position: 12% -8%; }
}`
    : ''

  const filterCss = style.filter ? `\n  filter: ${style.filter};` : ''
  const css = `.mesh-bg {
  background-color: ${baseColor};
  background-image:
    ${bg.replace(`, ${baseColor}`, '')};${filterCss}
}${cfg.grain ? `\n/* + an SVG fractal-noise overlay at opacity ${round(cfg.noise)} for grain */` : ''}${
    cfg.animate ? `\n\n${keyframesCss}` : ''
  }`

  return { style, svg, filterId, keyframesCss, css }
}
