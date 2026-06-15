import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Device, Theme } from '../types'

export type BgSource = 'blob' | 'mesh'

interface UiStore {
  device: Device
  theme: Theme
  bg: BgSource
  showCard: boolean
  setDevice: (d: Device) => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setBg: (b: BgSource) => void
  setShowCard: (v: boolean) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      device: 'desktop',
      theme: 'light',
      bg: 'blob',
      showCard: true,
      setDevice: (device) => set({ device }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setBg: (bg) => set({ bg }),
      setShowCard: (showCard) => set({ showCard }),
    }),
    { name: 'vusg-ui' },
  ),
)
