import { useUiStore, type BgSource } from '../store/useUiStore'
import type { Device } from '../types'

const DEVICES: { id: Device; label: string }[] = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'mobile', label: 'Mobile' },
]
const BGS: { id: BgSource; label: string }[] = [
  { id: 'blob', label: 'Blob' },
  { id: 'mesh', label: 'Mesh' },
]

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { id: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-lg bg-panel p-0.5 ring-1 ring-panel-line">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            value === o.id ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function PreviewToolbar() {
  const { device, theme, bg, showCard, setDevice, toggleTheme, setBg, setShowCard } = useUiStore()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented label="Background source" value={bg} options={BGS} onChange={setBg} />
      <Segmented label="Device size" value={device} options={DEVICES} onChange={setDevice} />
      <button
        type="button"
        aria-pressed={showCard}
        onClick={() => setShowCard(!showCard)}
        className={`rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-panel-line transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          showCard ? 'bg-accent text-white' : 'bg-panel text-ink-soft hover:text-ink'
        }`}
      >
        {showCard ? '▢ Card on' : '▢ Card off'}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-lg bg-panel px-2.5 py-1 text-xs font-medium text-ink-soft ring-1 ring-panel-line transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  )
}
