import type { StyleState, Tab } from '../types'
import { rgba, round } from '../lib/color'

/**
 * Tailwind-compatible values (PRD §5.7). Returns arbitrary-value utility
 * classes plus a `theme.extend` snippet for the focused generator.
 */
export function tailwindForTab(tab: Tab, state: StyleState): string {
  switch (tab) {
    case 'glass': {
      const g = state.glass
      const bg = rgba(g.bgColor, g.bgOpacity)
      const border = rgba(g.borderColor, g.borderOpacity)
      const utilities = [
        `bg-[${bg.replace(/\s/g, '')}]`,
        `backdrop-blur-[${g.blur}px]`,
        `backdrop-saturate-[${round(g.saturation)}]`,
        `border border-[${border.replace(/\s/g, '')}]`,
        `rounded-[${g.radius}px]`,
        `p-[${g.padding}px]`,
        `shadow-[0_${round(g.shadowBlur / 3)}px_${g.shadowBlur}px_${g.shadowSpread}px_${rgba(
          g.shadowColor,
          g.shadowIntensity,
        ).replace(/\s/g, '')}]`,
      ].join(' ')
      return `<!-- className -->\n${utilities}`
    }
    case 'blob': {
      const b = state.blob
      return [
        `<!-- container -->`,
        `relative overflow-hidden bg-[${b.bgColor}]`,
        ``,
        `<!-- each blob -->`,
        `absolute rounded-full blur-[${b.blur}px] opacity-[${round(b.opacity)}] mix-blend-${b.blendMode}`,
      ].join('\n')
    }
    case 'mesh': {
      const m = state.mesh
      return [
        `<!-- mesh container -->`,
        `bg-[${m.points[0]?.color ?? '#101018'}] blur-[${m.blur}px]`,
        `contrast-[${round(m.contrast)}] brightness-[${round(m.brightness)}]`,
        ``,
        `<!-- set the layered radial-gradients via the Copy CSS output's background-image -->`,
      ].join('\n')
    }
  }
}
