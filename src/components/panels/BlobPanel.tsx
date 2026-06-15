import { useStyleStore } from '../../store/useStyleStore'
import type { BlendMode, BlobConfig } from '../../types'
import { ColorField, Section, Select, Slider, Toggle } from '../controls'

const BLEND_OPTS: { value: BlendMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'screen', label: 'Screen' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft light' },
  { value: 'color-dodge', label: 'Color dodge' },
  { value: 'multiply', label: 'Multiply' },
]

const DIR_OPTS: { value: BlobConfig['animDirection']; label: string }[] = [
  { value: 'alternate', label: 'Alternate' },
  { value: 'normal', label: 'Normal' },
  { value: 'reverse', label: 'Reverse' },
]

export default function BlobPanel() {
  const b = useStyleStore((s) => s.blob)
  const set = useStyleStore((s) => s.setBlob)
  const setAt = useStyleStore((s) => s.setBlobAt)

  return (
    <div>
      <Section title="Layers">
        <Slider label="Number of blobs" value={b.count} min={1} max={b.blobs.length} onChange={(count) => set({ count })} />
        <Slider label="Blob size" value={b.size} min={120} max={800} unit="px" onChange={(size) => set({ size })} />
        <Slider label="Blur" value={b.blur} min={0} max={160} unit="px" onChange={(blur) => set({ blur })} />
        <Slider label="Opacity" value={b.opacity} min={0} max={1} step={0.01} onChange={(opacity) => set({ opacity })} />
        <Select label="Blend mode" value={b.blendMode} options={BLEND_OPTS} onChange={(blendMode) => set({ blendMode })} />
        <ColorField label="Background" value={b.bgColor} onChange={(bgColor) => set({ bgColor })} />
      </Section>

      <Section title="Colors & position">
        {b.blobs.slice(0, b.count).map((blob, i) => (
          <div key={i} className="space-y-2 rounded-lg bg-panel p-2.5 ring-1 ring-panel-line">
            <ColorField label={`Blob ${i + 1}`} value={blob.color} onChange={(color) => setAt(i, { color })} />
            <Slider label="X" value={blob.x} min={0} max={100} unit="%" onChange={(x) => setAt(i, { x })} />
            <Slider label="Y" value={blob.y} min={0} max={100} unit="%" onChange={(y) => setAt(i, { y })} />
          </div>
        ))}
      </Section>

      <Section title="Animation" defaultOpen={false}>
        <Toggle label="Animate" checked={b.animate} onChange={(animate) => set({ animate })} />
        <Slider label="Speed (loop seconds)" value={b.animSpeed} min={4} max={60} onChange={(animSpeed) => set({ animSpeed })} />
        <Select label="Direction" value={b.animDirection} options={DIR_OPTS} onChange={(animDirection) => set({ animDirection })} />
      </Section>
    </div>
  )
}
