import { useStyleStore } from '../store/useStyleStore'
import { useUiStore } from '../store/useUiStore'
import type { Tab } from '../types'
import BlobPanel from './panels/BlobPanel'
import MeshPanel from './panels/MeshPanel'
import GlassPanel from './panels/GlassPanel'

const TABS: { id: Tab; label: string }[] = [
  { id: 'blob', label: 'Blob' },
  { id: 'mesh', label: 'Mesh' },
  { id: 'glass', label: 'Glass' },
]

export default function ControlPanel() {
  const tab = useStyleStore((s) => s.tab)
  const setTab = useStyleStore((s) => s.setTab)
  const setBg = useUiStore((s) => s.setBg)
  const resetBlob = useStyleStore((s) => s.resetBlob)
  const resetMesh = useStyleStore((s) => s.resetMesh)
  const resetGlass = useStyleStore((s) => s.resetGlass)

  const reset = tab === 'blob' ? resetBlob : tab === 'mesh' ? resetMesh : resetGlass

  // Switching to the Blob/Mesh tab syncs the preview background so edits are
  // always visible; the Glass tab leaves the current background untouched.
  const selectTab = (t: Tab) => {
    setTab(t)
    if (t === 'blob' || t === 'mesh') setBg(t)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-panel p-1 ring-1 ring-panel-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => selectTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              tab === t.id ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div className="mt-3 flex-1 overflow-y-auto pr-1">
        {tab === 'blob' && <BlobPanel />}
        {tab === 'mesh' && <MeshPanel />}
        {tab === 'glass' && <GlassPanel />}
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-3 w-full rounded-lg border border-panel-line py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-panel hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Reset {tab} to defaults
      </button>
    </div>
  )
}
