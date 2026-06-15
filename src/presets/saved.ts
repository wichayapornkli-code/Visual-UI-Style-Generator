import type { SavedPreset, StyleState } from '../types'

const KEY = 'vusg-saved-presets'

export function loadSaved(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedPreset[]) : []
  } catch {
    return []
  }
}

function persist(list: SavedPreset[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function savePreset(name: string, state: StyleState): SavedPreset[] {
  const list = loadSaved()
  const preset: SavedPreset = {
    id: `custom-${Date.now()}`,
    name: name.trim() || `Preset ${list.length + 1}`,
    state: structuredClone(state),
    custom: true,
  }
  const next = [...list, preset]
  persist(next)
  return next
}

export function deletePreset(id: string): SavedPreset[] {
  const next = loadSaved().filter((p) => p.id !== id)
  persist(next)
  return next
}
