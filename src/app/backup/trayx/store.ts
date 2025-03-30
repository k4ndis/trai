// src/lib/store.ts
import { create } from "zustand"

interface InformationState {
  fields: Record<string, string>
  updateField: (key: string, value: string) => void
}

export const useInformationStore = create<InformationState>((set) => ({
  fields: {},
  updateField: (key, value) => set((state) => ({
    fields: {
      ...state.fields,
      [key]: value,
    },
  })),
}))