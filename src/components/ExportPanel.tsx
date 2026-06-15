import { useState, type RefObject } from 'react'
import { useStyleStore } from '../store/useStyleStore'
import { cssForTab } from '../export/toCss'
import { tailwindForTab } from '../export/toTailwind'
import { tokensJson } from '../export/toTokens'
import { toMarkdown } from '../export/toMarkdown'
import { toPrompt } from '../export/toPrompt'
import { downloadPng, downloadText } from '../export/toPng'
import { buildShareUrl } from '../export/shareUrl'

export default function ExportPanel({ previewRef }: { previewRef: RefObject<HTMLDivElement | null> }) {
  const tab = useStyleStore((s) => s.tab)
  const snapshot = useStyleStore((s) => s.snapshot)
  const [toast, setToast] = useState('')

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 1800)
  }

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    flash(`${label} copied`)
  }

  const code = cssForTab(tab, snapshot())

  const onPng = async () => {
    if (!previewRef.current) return
    try {
      await downloadPng(previewRef.current, 'ui-style.png')
      flash('PNG downloaded')
    } catch {
      flash('PNG capture failed')
    }
  }

  const onShare = async () => {
    const url = buildShareUrl(snapshot())
    history.replaceState(null, '', url)
    await navigator.clipboard.writeText(url)
    flash('Share link copied')
  }

  const Btn = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-panel-line bg-panel px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          Export — {tab}
        </span>
        <span className="text-xs text-accent">{toast}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Btn onClick={() => copy(code, 'CSS')}>Copy CSS</Btn>
        <Btn onClick={() => copy(tailwindForTab(tab, snapshot()), 'Tailwind')}>Copy Tailwind</Btn>
        <Btn onClick={() => downloadText(tokensJson(snapshot()), 'tokens.json')}>JSON tokens</Btn>
        <Btn onClick={() => copy(toMarkdown(snapshot()), 'Markdown')}>Copy Markdown</Btn>
        <Btn
          onClick={() => downloadText(toMarkdown(snapshot()), 'ui-style.md', 'text/markdown')}
        >
          Download .md
        </Btn>
        <Btn onClick={() => copy(toPrompt(snapshot()), 'Prompt')}>Copy prompt</Btn>
        <Btn onClick={onPng}>Download PNG</Btn>
        <Btn onClick={onShare}>Share link</Btn>
      </div>

      <pre className="max-h-40 overflow-auto rounded-lg bg-panel p-3 text-[11px] leading-relaxed text-ink-soft ring-1 ring-panel-line">
        <code>{code}</code>
      </pre>
    </div>
  )
}
