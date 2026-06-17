import { create } from 'zustand'
import { CarbonRecord } from '@/types'

interface CarbonState {
  currentRecord: CarbonRecord | null
  history: CarbonRecord[]
  isCalculating: boolean
  sessionId: string
  setCurrentRecord: (record: CarbonRecord) => void
  setHistory: (records: CarbonRecord[]) => void
  setCalculating: (val: boolean) => void
  clearCurrent: () => void
}

export const useCarbonStore = create<CarbonState>((set) => ({
  currentRecord: null,
  history: [],
  isCalculating: false,
  sessionId: crypto.randomUUID(),

  setCurrentRecord: (record) => set({ currentRecord: record }),
  setHistory: (records) => set({ history: records }),
  setCalculating: (val) => set({ isCalculating: val }),
  clearCurrent: () => set({ currentRecord: null })
}))
