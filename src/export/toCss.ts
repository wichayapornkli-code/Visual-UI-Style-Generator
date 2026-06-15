import type { StyleState, Tab } from '../types'
import { generateBlob } from '../generators/blob'
import { generateMesh } from '../generators/mesh'
import { generateGlass } from '../generators/glass'

/** Copyable CSS for the generator currently in focus. */
export function cssForTab(tab: Tab, state: StyleState): string {
  switch (tab) {
    case 'blob':
      return generateBlob(state.blob).css
    case 'mesh':
      return generateMesh(state.mesh).css
    case 'glass':
      return generateGlass(state.glass).css
  }
}

/** All three generators concatenated. */
export function cssForAll(state: StyleState): string {
  return [
    '/* ── Blob gradient background ── */',
    generateBlob(state.blob).css,
    '\n/* ── Mesh gradient background ── */',
    generateMesh(state.mesh).css,
    '\n/* ── Glass surface ── */',
    generateGlass(state.glass).css,
  ].join('\n')
}
