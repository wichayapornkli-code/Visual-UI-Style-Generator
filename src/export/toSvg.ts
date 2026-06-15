import type { StyleState } from '../types'
import { round } from '../lib/color'

const W = 1200
const H = 750

/** Distance from (cx,cy) to the farthest viewBox corner — matches CSS
 *  `radial-gradient(circle …)` default (farthest-corner) sizing. */
function farthestCorner(cx: number, cy: number): number {
  const dx = Math.max(cx, W - cx)
  const dy = Math.max(cy, H - cy)
  return Math.sqrt(dx * dx + dy * dy)
}

/** A `<feComponentTransfer>` reproducing CSS `contrast(c) brightness(b)`
 *  (applied in that order): out = v·c·b + (0.5 − 0.5c)·b. */
function toneTransfer(contrast: number, brightness: number): string {
  if (contrast === 1 && brightness === 1) return ''
  const slope = round(contrast * brightness, 4)
  const intercept = round((0.5 - 0.5 * contrast) * brightness, 4)
  const fn = `<feFuncR type="linear" slope="${slope}" intercept="${intercept}"/><feFuncG type="linear" slope="${slope}" intercept="${intercept}"/><feFuncB type="linear" slope="${slope}" intercept="${intercept}"/>`
  return `<feComponentTransfer>${fn}</feComponentTransfer>`
}

/**
 * A self-contained SVG that reproduces what the preview renders, for importing
 * into Figma. Background gradients become editable Figma gradient fills; CSS blur
 * is reproduced with `feGaussianBlur`. The glass card's backdrop blur cannot be
 * expressed in SVG and is emitted as a flat translucent rect (reapply as a
 * Background Blur effect in Figma).
 */
export function toSvg(state: StyleState, bg: 'blob' | 'mesh'): string {
  const defs: string[] = []
  const body: string[] = []

  if (bg === 'blob') {
    const b = state.blob
    // Shared blur filter (generous region so blurred edges aren't clipped early).
    defs.push(
      `    <filter id="blobBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${b.blur}"/>
    </filter>`,
    )
    const circles = b.blobs
      .slice(0, b.count)
      .map((blob) => {
        const cx = round((blob.x / 100) * W)
        const cy = round((blob.y / 100) * H)
        return `    <circle cx="${cx}" cy="${cy}" r="${round(b.size / 2)}" fill="${blob.color}" filter="url(#blobBlur)" style="mix-blend-mode:${b.blendMode}"/>`
      })
      .join('\n')
    body.push(`  <rect width="${W}" height="${H}" fill="${b.bgColor}"/>`)
    // isolate so blobs blend with each other + the bg, matching the preview.
    body.push(`  <g style="isolation:isolate">\n${circles}\n  </g>`)
  } else {
    const m = state.mesh
    const base = m.points[0]?.color ?? '#101018'
    const reach = round(38 * m.intensity * m.scale + 10) // %

    // Filter that mirrors the preview's `filter: blur() contrast() brightness()`.
    const tone = toneTransfer(m.contrast, m.brightness)
    defs.push(
      `    <filter id="meshFx" x="-20%" y="-20%" width="140%" height="140%">
      ${m.blur > 0 ? `<feGaussianBlur stdDeviation="${m.blur}"/>` : ''}${tone}
    </filter>`,
    )

    const rects: string[] = [`    <rect width="${W}" height="${H}" fill="${base}"/>`]
    m.points.forEach((p, i) => {
      const cx = round((p.x / 100) * W)
      const cy = round((p.y / 100) * H)
      const r = round((reach / 100) * farthestCorner(cx, cy))
      defs.push(
        `    <radialGradient id="mesh${i}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
      <stop offset="0%" stop-color="${p.color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${p.color}" stop-opacity="0"/>
    </radialGradient>`,
      )
      rects.push(`    <rect width="${W}" height="${H}" fill="url(#mesh${i})"/>`)
    })
    body.push(`  <g filter="url(#meshFx)">\n${rects.join('\n')}\n  </g>`)

    // Optional grain overlay, matching the preview's fractal-noise grain.
    if (m.grain && m.noise > 0) {
      defs.push(
        `    <filter id="meshGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`,
      )
      body.push(
        `  <rect width="${W}" height="${H}" filter="url(#meshGrain)" opacity="${round(m.noise)}" style="mix-blend-mode:overlay"/>`,
      )
    }
  }

  // Glass card — flat translucent rect (backdrop blur not representable in SVG).
  const g = state.glass
  const cw = g.width
  const ch = g.height
  const cx = round((W - cw) / 2)
  const cy = round((H - ch) / 2)
  body.push(
    `  <!-- Glass card: backdrop blur (${g.blur}px) is not representable in SVG.
       In Figma, select this rect and add Effect > Background Blur. -->
  <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="${g.radius}"
    fill="${g.bgColor}" fill-opacity="${round(g.bgOpacity)}"
    stroke="${g.borderColor}" stroke-opacity="${round(g.borderOpacity)}" stroke-width="1"/>`,
  )

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
${defs.join('\n')}
  </defs>
${body.join('\n')}
</svg>`
}
