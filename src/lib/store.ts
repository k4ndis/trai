// src/lib/store.ts
import { create } from "zustand"

interface InformationState {
  fields: Record<string, string>
  updateField: (key: string, value: string) => void
  activeSection: string
  setActiveSection: (section: string) => void
}

export const useInformationStore = create<InformationState>((set) => ({
  fields: {},
  activeSection: "",

  updateField: (key, value) => set((state) => ({
    fields: {
      ...state.fields,
      [key]: value,
    },
  })),

  setActiveSection: (section) => set({ activeSection: section }),
}))