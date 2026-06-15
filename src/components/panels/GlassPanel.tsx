import { useStyleStore } from '../../store/useStyleStore'
import { ColorField, NumberInput, Section, Select, Slider } from '../controls'

const MODE_OPTS = [
  { value: 'frosted', label: 'Frosted (classic)' },
  { value: 'liquid', label: 'Liquid (iOS-style)' },
] as const

export default function GlassPanel() {
  const g = useStyleStore((s) => s.glass)
  const set = useStyleStore((s) => s.setGlass)
  const isLiquid = g.mode === 'liquid'

  return (
    <div>
      <Section title="Surface">
        <Select label="Mode" value={g.mode} options={MODE_OPTS} onChange={(mode) => set({ mode })} />
        <ColorField label="Background color" value={g.bgColor} onChange={(bgColor) => set({ bgColor })} />
        <Slider label="Background opacity" value={g.bgOpacity} min={0} max={1} step={0.01} onChange={(bgOpacity) => set({ bgOpacity })} />
        <Slider label="Blur" value={g.blur} min={0} max={60} unit="px" onChange={(blur) => set({ blur })} />
        <Slider label="Saturation" value={g.saturation} min={0.5} max={3} step={0.05} unit="×" onChange={(saturation) => set({ saturation })} />
      </Section>

      <Section title="Border & highlight">
        <ColorField label="Border color" value={g.borderColor} onChange={(borderColor) => set({ borderColor })} />
        <Slider label="Border opacity" value={g.borderOpacity} min={0} max={1} step={0.01} onChange={(borderOpacity) => set({ borderOpacity })} />
        <Slider label="Highlight edge" value={g.highlightOpacity} min={0} max={1} step={0.01} onChange={(highlightOpacity) => set({ highlightOpacity })} />
      </Section>

      <Section title="Shadow" defaultOpen={false}>
        <ColorField label="Shadow color" value={g.shadowColor} onChange={(shadowColor) => set({ shadowColor })} />
        <Slider label="Shadow intensity" value={g.shadowIntensity} min={0} max={1} step={0.01} onChange={(shadowIntensity) => set({ shadowIntensity })} />
        <Slider label="Shadow blur" value={g.shadowBlur} min={0} max={120} unit="px" onChange={(shadowBlur) => set({ shadowBlur })} />
        <Slider label="Shadow spread" value={g.shadowSpread} min={-20} max={40} unit="px" onChange={(shadowSpread) => set({ shadowSpread })} />
      </Section>

      {isLiquid && (
        <Section title="Liquid glass">
          <Slider label="Refraction" value={g.refraction} min={0} max={100} onChange={(refraction) => set({ refraction })} />
          <Slider label="Specular" value={g.specularIntensity} min={0} max={1} step={0.01} onChange={(specularIntensity) => set({ specularIntensity })} />
          <Slider label="Glossiness" value={g.glossiness} min={0} max={1} step={0.01} onChange={(glossiness) => set({ glossiness })} />
          <Slider label="Edge width" value={g.edgeWidth} min={0} max={6} step={0.5} unit="px" onChange={(edgeWidth) => set({ edgeWidth })} />
          <p className="text-[11px] leading-snug text-ink-soft">
            Backdrop refraction has limited browser support; gloss &amp; specular degrade gracefully.
          </p>
        </Section>
      )}

      <Section title="Box" defaultOpen={false}>
        <Slider label="Corner radius" value={g.radius} min={0} max={60} unit="px" onChange={(radius) => set({ radius })} />
        <Slider label="Padding" value={g.padding} min={0} max={64} unit="px" onChange={(padding) => set({ padding })} />
        <NumberInput label="Width" value={g.width} min={120} max={900} unit="px" onChange={(width) => set({ width })} />
        <NumberInput label="Height" value={g.height} min={80} max={700} unit="px" onChange={(height) => set({ height })} />
      </Section>
    </div>
  )
}
