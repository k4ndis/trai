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

interface SampleImage {
  url: string
  label: string
}

interface Sample {
  id: number
  productNumber: string
  productionDate: string
  serialNumber: string
  features: string
  images: SampleImage[]
}

interface InformationState {
  fields: InformationFields
  testSequences: TestSequence[]
  samples: Sample[]
  updateField: (fieldId: string, value: string) => void
  updateMultipleFields: (newFields: InformationFields) => void
  setTestSequences: (sequences: TestSequence[]) => void
  setSamples: (samples: Sample[]) => void
  addSampleImage: (sampleId: number, image: SampleImage) => void
  removeSampleImage: (sampleId: number, imageUrl: string) => void
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
  addSampleImage: (sampleId, image) =>
    set((state) => ({
      samples: state.samples.map((s) =>
        s.id === sampleId ? { ...s, images: [...(s.images || []), image] } : s
      ),
    })),
  removeSampleImage: (sampleId, imageUrl) =>
    set((state) => ({
      samples: state.samples.map((s) =>
        s.id === sampleId
          ? { ...s, images: s.images.filter((img) => img.url !== imageUrl) }
          : s
      ),
    })),
}))

type UIState = {
  isMobileSidebarOpen: boolean
  isSearchOpen: boolean
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  openSearch: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileSidebarOpen: false,
  isSearchOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}))
