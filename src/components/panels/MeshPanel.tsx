import { useStyleStore } from '../../store/useStyleStore'
import { ColorField, Section, Slider, Toggle } from '../controls'

export default function MeshPanel() {
  const m = useStyleStore((s) => s.mesh)
  const set = useStyleStore((s) => s.setMesh)
  const setAt = useStyleStore((s) => s.setMeshPointAt)

  return (
    <div>
      <Section title="Color points">
        {m.points.map((p, i) => (
          <div key={i} className="space-y-2 rounded-lg bg-panel p-2.5 ring-1 ring-panel-line">
            <ColorField label={`Point ${i + 1}`} value={p.color} onChange={(color) => setAt(i, { color })} />
            <Slider label="X" value={p.x} min={0} max={100} unit="%" onChange={(x) => setAt(i, { x })} />
            <Slider label="Y" value={p.y} min={0} max={100} unit="%" onChange={(y) => setAt(i, { y })} />
          </div>
        ))}
      </Section>

      <Section title="Mesh">
        <Slider label="Color intensity" value={m.intensity} min={0} max={1} step={0.01} onChange={(intensity) => set({ intensity })} />
        <Slider label="Blur softness" value={m.blur} min={0} max={120} unit="px" onChange={(blur) => set({ blur })} />
        <Slider label="Scale" value={m.scale} min={0.5} max={2} step={0.05} unit="×" onChange={(scale) => set({ scale })} />
        <Slider label="Distortion" value={m.distortion} min={0} max={100} onChange={(distortion) => set({ distortion })} />
      </Section>

      <Section title="Tone" defaultOpen={false}>
        <Slider label="Contrast" value={m.contrast} min={0.5} max={2} step={0.05} unit="×" onChange={(contrast) => set({ contrast })} />
        <Slider label="Brightness" value={m.brightness} min={0.5} max={2} step={0.05} unit="×" onChange={(brightness) => set({ brightness })} />
      </Section>

      <Section title="Texture & animation" defaultOpen={false}>
        <Toggle label="Grain" checked={m.grain} onChange={(grain) => set({ grain })} />
        <Slider label="Noise amount" value={m.noise} min={0} max={0.4} step={0.01} onChange={(noise) => set({ noise })} />
        <Toggle label="Animate" checked={m.animate} onChange={(animate) => set({ animate })} />
        <Slider label="Speed (loop seconds)" value={m.animSpeed} min={4} max={60} onChange={(animSpeed) => set({ animSpeed })} />
      </Section>
    </div>
  )
}
