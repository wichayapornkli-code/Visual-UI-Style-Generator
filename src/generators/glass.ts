import type { CSSProperties } from 'react'
import type { GlassConfig } from '../types'
import { rgba, round } from '../lib/color'

export interface GlassOutput {
  /** Inline style for the glass card in the preview. */
  style: CSSProperties
  /** SVG filter markup for liquid mode (refraction + specular), '' for frosted. */
  svg: string
  filterId: string
  /** Design tokens object (also used by the JSON export). */
  tokens: Record<string, string | number>
  css: string
}

const FILTER_ID = 'liquid-glass'

export function generateGlass(cfg: GlassConfig): GlassOutput {
  const isLiquid = cfg.mode === 'liquid'
  const bg = rgba(cfg.bgColor, cfg.bgOpacity)
  const border = rgba(cfg.borderColor, cfg.borderOpacity)
  const backdrop = `blur(${cfg.blur}px) saturate(${round(cfg.saturation * 100)}%)`

  // Outer drop shadow + inset highlight edge (top-lit).
  const dropShadow = `0 ${round(cfg.shadowBlur / 3)}px ${cfg.shadowBlur}px ${cfg.shadowSpread}px ${rgba(
    cfg.shadowColor,
    cfg.shadowIntensity,
  )}`
  const insetHighlight = `inset 0 1px 0 0 ${rgba('#ffffff', cfg.highlightOpacity)}`
  const boxShadow = isLiquid
    ? `${dropShadow}, ${insetHighlight}, inset 0 0 0 ${round(cfg.edgeWidth)}px ${rgba(
        '#ffffff',
        cfg.highlightOpacity * 0.6,
      )}`
    : `${dropShadow}, ${insetHighlight}`

  // Liquid mode adds a convex gloss overlay (layered highlights) on top of bg.
  const gloss = isLiquid
    ? `radial-gradient(120% 80% at 30% 0%, ${rgba(
        '#ffffff',
        0.45 * cfg.glossiness,
      )} 0%, ${rgba('#ffffff', 0)} 40%), linear-gradient(180deg, ${rgba(
        '#ffffff',
        0.18 * cfg.glossiness,
      )} 0%, ${rgba('#ffffff', 0)} 35%), `
    : ''

  const style: CSSProperties = {
    width: `${cfg.width}px`,
    height: `${cfg.height}px`,
    padding: `${cfg.padding}px`,
    borderRadius: `${cfg.radius}px`,
    background: `${gloss}${bg}`,
    border: `1px solid ${border}`,
    boxShadow,
    backdropFilter: isLiquid ? `${backdrop} url(#${FILTER_ID})` : backdrop,
    WebkitBackdropFilter: backdrop,
    boxSizing: 'border-box',
  }

  const filterId = isLiquid ? FILTER_ID : ''
  const svg = isLiquid
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute">
  <filter id="${FILTER_ID}" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="11" result="noise"/>
    <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
    <feDisplacementMap in="SourceGraphic" in2="soft" scale="${round(
      cfg.refraction,
    )}" xChannelSelector="R" yChannelSelector="G" result="refracted"/>
    <feSpecularLighting in="soft" surfaceScale="3" specularConstant="${round(
      cfg.specularIntensity,
    )}" specularExponent="20" lighting-color="#ffffff" result="spec">
      <fePointLight x="-50" y="-100" z="200"/>
    </feSpecularLighting>
    <feComposite in="spec" in2="refracted" operator="in" result="specClipped"/>
    <feComposite in="refracted" in2="specClipped" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
  </filter>
</svg>`
    : ''

  const tokens: Record<string, string | number> = {
    'glass-mode': cfg.mode,
    'glass-bg': bg,
    'glass-blur': `${cfg.blur}px`,
    'glass-saturation': `${round(cfg.saturation * 100)}%`,
    'glass-border': border,
    'glass-radius': `${cfg.radius}px`,
    'glass-shadow': dropShadow,
    'glass-padding': `${cfg.padding}px`,
  }
  if (isLiquid) {
    tokens['glass-refraction'] = cfg.refraction
    tokens['glass-specular'] = round(cfg.specularIntensity)
    tokens['glass-gloss'] = round(cfg.glossiness)
    tokens['glass-edge'] = `${round(cfg.edgeWidth)}px`
  }

  const css = `.glass-card {
  width: ${cfg.width}px;
  height: ${cfg.height}px;
  padding: ${cfg.padding}px;
  border-radius: ${cfg.radius}px;
  background: ${gloss}${bg};
  border: 1px solid ${border};
  box-shadow: ${boxShadow};
  -webkit-backdrop-filter: ${backdrop};
  backdrop-filter: ${isLiquid ? `${backdrop} url(#${FILTER_ID})` : backdrop};
  box-sizing: border-box;
}${
    isLiquid
      ? `\n\n/* Liquid mode needs this SVG filter in your document.
   Note: backdrop refraction (url(#filter) in backdrop-filter) has
   limited browser support; the gloss + specular layers degrade gracefully. */\n${svg}`
      : ''
  }`

  return { style, svg, filterId, tokens, css }
}
