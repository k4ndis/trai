// src/lib/store.ts
import { create } from "zustand"

interface InformationFields {
  [key: string]: string
}

interface TestSequence {
  id: number
  type: string
  temperatures: string[]
  values: string[]
  mode: string[]
  startDate: string
  endDate: string
  testbench: string
  cycles: string
  temperature: string
  dwelltime: string
  comment: string
}

interface Sample {
  id: number
  productNumber: string
  productionDate: string
  serialNumber: string
  features: string
}

interface InformationState {
  fields: InformationFields
  testSequences: TestSequence[]
  samples: Sample[]
  updateField: (fieldId: string, value: string) => void
  updateMultipleFields: (newFields: InformationFields) => void
  setTestSequences: (sequences: TestSequence[]) => void
  setSamples: (samples: Sample[]) => void
}

export const useInformationStore = create<InformationState>((set) => ({
  fields: {},
  testSequences: [],
  samples: [],
  updateField: (fieldId, value) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [fieldId]: value,
      },
    })),
  updateMultipleFields: (newFields) =>
    set((state) => ({
      fields: {
        ...state.fields,
        ...newFields,
      },
    })),
  setTestSequences: (sequences) => set({ testSequences: sequences }),
  setSamples: (samples) => set({ samples }),
}))
