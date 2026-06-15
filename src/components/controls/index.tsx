import { useId, useState, type ReactNode } from 'react'

// ── Slider ───────────────────────────────────────────────────────────────────
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  const id = useId()
  return (
    <label htmlFor={id} className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-ink-soft">{label}</span>
        <span className="text-xs tabular-nums text-ink">
          {Math.round(value * 100) / 100}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  )
}

// ── ColorField ─────────────────────────────────────────────────────────────
export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-xs tabular-nums text-ink uppercase">{value}</span>
        <input
          id={id}
          type="color"
          className="h-7 w-9 rounded-md ring-1 ring-panel-line"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </label>
  )
}

// ── NumberInput ──────────────────────────────────────────────────────────────
export function NumberInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <span className="flex items-center gap-1">
        <input
          id={id}
          type="number"
          className="w-20 rounded-md bg-panel px-2 py-1 text-xs text-ink ring-1 ring-panel-line focus:outline-none focus:ring-2 focus:ring-accent"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value || '0'))}
        />
        {unit && <span className="text-xs text-ink-soft">{unit}</span>}
      </span>
    </label>
  )
}

// ── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          checked ? 'bg-accent' : 'bg-panel-line'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

// ── Select ───────────────────────────────────────────────────────────────────
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <select
        id={id}
        className="rounded-md bg-panel px-2 py-1 text-xs text-ink ring-1 ring-panel-line focus:outline-none focus:ring-2 focus:ring-accent"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// ── Section (collapsible) ─────────────────────────────────────────────────────
export function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-b border-panel-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          {title}
        </span>
        <span className={`text-ink-soft transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      {open && <div className="space-y-3 pb-4">{children}</div>}
    </section>
  )
}
