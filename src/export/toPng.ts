import { toPng } from 'html-to-image'

/** Capture a DOM node as a PNG and trigger a download. */
export async function downloadPng(node: HTMLElement, filename = 'ui-style.png') {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
  })
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

/** Download arbitrary text as a file (used for JSON tokens). */
export function downloadText(text: string, filename: string, type = 'application/json') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
