import type { CSSProperties } from 'react'
import type { BlobConfig } from '../types'
import { round } from '../lib/color'

export interface BlobLayer {
  key: string
  style: CSSProperties
}

export interface BlobOutput {
  bgColor: string
  layers: BlobLayer[]
  /** @keyframes blocks, shared by the live preview (<style>) and the export. */
  keyframesCss: string
  /** Full copyable CSS snippet. */
  css: string
}

/** Per-blob drift path. Deterministic per index so presets/share are stable. */
function drift(i: number): string {
  const dx = [6, -8, 5, -6, 7][i % 5]
  const dy = [-7, 6, -5, 8, -6][i % 5]
  const name = `blobFloat${i}`
  return `@keyframes ${name} {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(${dx}%, ${dy}%) scale(1.08); }
  100% { transform: translate(0, 0) scale(1); }
}`
}

export function generateBlob(cfg: BlobConfig): BlobOutput {
  const n = Math.min(cfg.count, cfg.blobs.length)
  const active = cfg.blobs.slice(0, n)

  const layers: BlobLayer[] = active.map((b, i) => ({
    key: `blob-${i}`,
    style: {
      position: 'absolute',
      left: `${b.x}%`,
      top: `${b.y}%`,
      width: `${cfg.size}px`,
      height: `${cfg.size}px`,
      marginLeft: `${-cfg.size / 2}px`,
      marginTop: `${-cfg.size / 2}px`,
      borderRadius: '50%',
      background: b.color,
      opacity: cfg.opacity,
      filter: `blur(${cfg.blur}px)`,
      mixBlendMode: cfg.blendMode as CSSProperties['mixBlendMode'],
      animation: cfg.animate
        ? `blobFloat${i} ${cfg.animSpeed}s ease-in-out ${cfg.animDirection} infinite`
        : undefined,
      willChange: cfg.animate ? 'transform' : undefined,
    },
  }))

  const keyframesCss = cfg.animate
    ? active.map((_, i) => drift(i)).join('\n')
    : ''

  // Export: a container + the blob layers as a reusable block.
  const layerCss = active
    .map(
      (b, i) => `.blob-bg .blob:nth-child(${i + 1}) {
  left: ${b.x}%; top: ${b.y}%;
  width: ${cfg.size}px; height: ${cfg.size}px;
  margin: ${round(-cfg.size / 2)}px 0 0 ${round(-cfg.size / 2)}px;
  background: ${b.color};${
    cfg.animate
      ? `\n  animation: blobFloat${i} ${cfg.animSpeed}s ease-in-out ${cfg.animDirection} infinite;`
      : ''
  }
}`,
    )
    .join('\n')

  const css = `.blob-bg {
  position: relative;
  overflow: hidden;
  background: ${cfg.bgColor};
}
.blob-bg .blob {
  position: absolute;
  border-radius: 50%;
  opacity: ${round(cfg.opacity)};
  filter: blur(${cfg.blur}px);
  mix-blend-mode: ${cfg.blendMode};
  will-change: transform;
}
${layerCss}${cfg.animate ? `\n\n${keyframesCss}` : ''}`

  return { bgColor: cfg.bgColor, layers, keyframesCss, css }
}
