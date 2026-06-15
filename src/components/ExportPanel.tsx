import { useState, type RefObject } from 'react'
import { useStyleStore } from '../store/useStyleStore'
import { useUiStore } from '../store/useUiStore'
import { cssForTab } from '../export/toCss'
import { tailwindForTab } from '../export/toTailwind'
import { tokensJson } from '../export/toTokens'
import { toMarkdown } from '../export/toMarkdown'
import { toPrompt } from '../export/toPrompt'
import { toSvg } from '../export/toSvg'
import { downloadPng, downloadText } from '../export/toPng'
import { buildShareUrl } from '../export/shareUrl'

interface Action {
  label: string // e.g. "Copy" or "Download .css"
  run: () => void
}

/** One export category: a chip + caret that opens a Copy/Download menu. */
function ExportItem({ label, actions }: { label: string; actions: Action[] }) {
  // Single-action categories render a plain button (no menu needed).
  if (actions.length === 1) {
    return (
      <button
        type="button"
        onClick={actions[0].run}
        className="rounded-md border border-panel-line bg-panel px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {label}
      </button>
    )
  }
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md border border-panel-line bg-panel px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
        {label}
        <span className="text-[9px] text-ink-soft transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="absolute bottom-full left-0 z-20 mb-1 min-w-32 overflow-hidden rounded-lg border border-panel-line bg-panel-soft py-1 shadow-xl">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={(e) => {
              a.run()
              e.currentTarget.closest('details')?.removeAttribute('open')
            }}
            className="block w-full px-3 py-1.5 text-left text-xs text-ink-soft transition-colors hover:bg-panel hover:text-ink focus:outline-none focus-visible:bg-panel"
          >
            {a.label}
          </button>
        ))}
      </div>
    </details>
  )
}

export default function ExportPanel({ previewRef }: { previewRef: RefObject<HTMLDivElement | null> }) {
  const tab = useStyleStore((s) => s.tab)
  const snapshot = useStyleStore((s) => s.snapshot)
  const bg = useUiStore((s) => s.bg)
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

  // Categories — each gets a Copy and/or Download action. Generators run at
  // click time off the current snapshot so output always matches the preview.
  const items: { label: string; actions: Action[] }[] = [
    {
      label: 'CSS',
      actions: [
        { label: 'Copy', run: () => copy(cssForTab(tab, snapshot()), 'CSS') },
        {
          label: 'Download .css',
          run: () => downloadText(cssForTab(tab, snapshot()), `style-${tab}.css`, 'text/css'),
        },
      ],
    },
    {
      label: 'Tailwind',
      actions: [
        { label: 'Copy', run: () => copy(tailwindForTab(tab, snapshot()), 'Tailwind') },
        {
          label: 'Download .txt',
          run: () => downloadText(tailwindForTab(tab, snapshot()), 'tailwind.txt', 'text/plain'),
        },
      ],
    },
    {
      label: 'Tokens',
      actions: [
        { label: 'Copy', run: () => copy(tokensJson(snapshot()), 'Tokens') },
        { label: 'Download .json', run: () => downloadText(tokensJson(snapshot()), 'tokens.json') },
      ],
    },
    {
      label: 'Markdown',
      actions: [
        { label: 'Copy', run: () => copy(toMarkdown(snapshot()), 'Markdown') },
        {
          label: 'Download .md',
          run: () => downloadText(toMarkdown(snapshot()), 'ui-style.md', 'text/markdown'),
        },
      ],
    },
    {
      label: 'Prompt',
      actions: [
        { label: 'Copy', run: () => copy(toPrompt(snapshot()), 'Prompt') },
        {
          label: 'Download .txt',
          run: () => downloadText(toPrompt(snapshot()), 'prompt.txt', 'text/plain'),
        },
      ],
    },
    {
      label: 'SVG',
      actions: [
        { label: 'Copy', run: () => copy(toSvg(snapshot(), bg), 'SVG') },
        {
          label: 'Download .svg',
          run: () => downloadText(toSvg(snapshot(), bg), 'ui-style.svg', 'image/svg+xml'),
        },
      ],
    },
    { label: 'PNG', actions: [{ label: 'Download .png', run: onPng }] },
    { label: 'Share', actions: [{ label: 'Copy link', run: onShare }] },
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          Export — {tab}
        </span>
        <span className="text-xs text-accent">{toast}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <ExportItem key={it.label} label={it.label} actions={it.actions} />
        ))}
      </div>

      <pre className="max-h-40 overflow-auto rounded-lg bg-panel p-3 text-[11px] leading-relaxed text-ink-soft ring-1 ring-panel-line">
        <code>{code}</code>
      </pre>
    </div>
  )
}
