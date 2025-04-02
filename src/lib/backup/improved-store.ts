// src/lib/store.ts
import { create } from "zustand"

interface InformationState {
  fields: Record<string, string>
  updateField: (key: string, value: string) => void
  getField: (key: string) => string
  activeSection: string
  setActiveSection: (section: string) => void
}

export const useInformationStore = create<InformationState>((set, get) => ({
  fields: {},
  activeSection: "",
  
  updateField: (key, value) => set((state) => ({
    fields: {
      ...state.fields,
      [key]: value,
    },
  })),
  
  getField: (key) => {
    const state = get();
    return state.fields[key] || "";
  },

  setActiveSection: (section) => set({ activeSection: section }),
}))
