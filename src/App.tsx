import { useRef } from 'react'
import ControlPanel from './components/ControlPanel'
import PreviewCanvas from './components/PreviewCanvas'
import PreviewToolbar from './components/PreviewToolbar'
import PresetBar from './components/PresetBar'
import ExportPanel from './components/ExportPanel'

export default function App() {
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left: controls */}
      <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-panel-line bg-panel-soft p-4 lg:h-full lg:w-[340px] lg:border-b-0 lg:border-r">
        <header>
          <h1 className="text-base font-semibold text-ink">Visual UI Style Generator</h1>
          <p className="text-xs text-ink-soft">Blob · Mesh · Glass — live preview & export</p>
        </header>
        <PresetBar />
        <div className="min-h-0 flex-1">
          <ControlPanel />
        </div>
      </aside>

      {/* Right: preview + export */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-panel-line bg-panel-soft px-4 py-3">
          <PreviewToolbar />
        </div>
        <div className="min-h-0 flex-1">
          <PreviewCanvas ref={previewRef} />
        </div>
        <div className="border-t border-panel-line bg-panel-soft p-4">
          <ExportPanel previewRef={previewRef} />
        </div>
      </main>
    </div>
  )
}
