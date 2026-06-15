import { useState } from 'react'
import { useStyleStore } from '../store/useStyleStore'
import { useUiStore } from '../store/useUiStore'
import { PRESETS } from '../presets'
import { deletePreset, loadSaved, savePreset } from '../presets/saved'
import type { SavedPreset } from '../types'

export default function PresetBar() {
  const apply = useStyleStore((s) => s.applyState)
  const snapshot = useStyleStore((s) => s.snapshot)
  const setBg = useUiStore((s) => s.setBg)
  const [saved, setSaved] = useState<SavedPreset[]>(() => loadSaved())

  // Apply a preset's style and switch the preview to its preferred background.
  const applyPreset = (p: { state: SavedPreset['state']; bg?: 'blob' | 'mesh' }) => {
    apply(p.state)
    if (p.bg) setBg(p.bg)
  }

  const onSave = () => {
    const name = window.prompt('Name this preset:')
    if (name === null) return
    setSaved(savePreset(name, snapshot()))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          Presets
        </span>
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          + Save current
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            className="rounded-full border border-panel-line bg-panel px-3 py-1 text-xs text-ink-soft transition-colors hover:border-accent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {p.name}
          </button>
        ))}
      </div>

      {saved.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-panel-line pt-2">
          {saved.map((p) => (
            <span
              key={p.id}
              className="group flex items-center gap-1 rounded-full border border-accent/40 bg-panel px-2.5 py-1 text-xs text-ink"
            >
              <button
                type="button"
                onClick={() => applyPreset(p)}
                className="focus:outline-none"
              >
                {p.name}
              </button>
              <button
                type="button"
                aria-label={`Delete ${p.name}`}
                onClick={() => setSaved(deletePreset(p.id))}
                className="text-ink-soft hover:text-ink"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
