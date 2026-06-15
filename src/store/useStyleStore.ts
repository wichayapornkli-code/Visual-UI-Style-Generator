import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BlobConfig, GlassConfig, MeshConfig, StyleState, Tab } from '../types'
import { DEFAULT_BLOB, DEFAULT_GLASS, DEFAULT_MESH, DEFAULT_STATE, cloneState } from '../defaults'
import { decodeState } from '../export/shareUrl'

interface StyleStore extends StyleState {
  tab: Tab
  setTab: (t: Tab) => void
  setBlob: (patch: Partial<BlobConfig>) => void
  setMesh: (patch: Partial<MeshConfig>) => void
  setGlass: (patch: Partial<GlassConfig>) => void
  setBlobAt: (index: number, patch: Partial<BlobConfig['blobs'][number]>) => void
  setMeshPointAt: (index: number, patch: Partial<MeshConfig['points'][number]>) => void
  applyState: (s: StyleState) => void
  resetBlob: () => void
  resetMesh: () => void
  resetGlass: () => void
  resetAll: () => void
  snapshot: () => StyleState
}

export const useStyleStore = create<StyleStore>()(
  persist(
    (set, get) => ({
      ...cloneState(DEFAULT_STATE),
      tab: 'blob',
      setTab: (tab) => set({ tab }),
      setBlob: (patch) => set((s) => ({ blob: { ...s.blob, ...patch } })),
      setMesh: (patch) => set((s) => ({ mesh: { ...s.mesh, ...patch } })),
      setGlass: (patch) => set((s) => ({ glass: { ...s.glass, ...patch } })),
      setBlobAt: (index, patch) =>
        set((s) => {
          const blobs = s.blob.blobs.map((b, i) => (i === index ? { ...b, ...patch } : b))
          return { blob: { ...s.blob, blobs } }
        }),
      setMeshPointAt: (index, patch) =>
        set((s) => {
          const points = s.mesh.points.map((p, i) => (i === index ? { ...p, ...patch } : p))
          return { mesh: { ...s.mesh, points } }
        }),
      applyState: (st) => set(cloneState(st)),
      resetBlob: () => set({ blob: cloneState(DEFAULT_BLOB) }),
      resetMesh: () => set({ mesh: cloneState(DEFAULT_MESH) }),
      resetGlass: () => set({ glass: cloneState(DEFAULT_GLASS) }),
      resetAll: () => set(cloneState(DEFAULT_STATE)),
      snapshot: () => {
        const { blob, mesh, glass } = get()
        return { blob, mesh, glass }
      },
    }),
    {
      name: 'vusg-state',
      partialize: (s) => ({ blob: s.blob, mesh: s.mesh, glass: s.glass, tab: s.tab }),
    },
  ),
)

/** Hydrate from a `#s=` URL hash if present (URL wins over localStorage). */
export function hydrateFromUrl() {
  const decoded = decodeState(window.location.hash)
  if (decoded) useStyleStore.getState().applyState(decoded)
}
