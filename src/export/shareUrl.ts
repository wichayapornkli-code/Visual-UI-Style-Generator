import type { StyleState } from '../types'

/** base64url-encode a JSON-serializable object (unicode-safe). */
function encode(obj: unknown): string {
  const json = JSON.stringify(obj)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decode<T>(b64url: string): T | null {
  try {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

/** Build a full shareable URL embedding the current state in the hash. */
export function buildShareUrl(state: StyleState): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#s=${encode(state)}`
}

/** Parse a `#s=...` hash into a StyleState, or null if absent/invalid. */
export function decodeState(hash: string): StyleState | null {
  const m = hash.match(/[#&]s=([^&]+)/)
  if (!m) return null
  return decode<StyleState>(m[1])
}
