// src/lib/store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface InformationFields {
  [key: string]: string
}

export interface TestSequence {
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
  sampleIds: number[]
}

export interface SampleImage {
  url: string
  label: string
}

export interface Sample {
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
  updateTestSequence: (
    id: number,
    field: keyof TestSequence,
    value: string | number | string[] | number[]
  ) => void
  setSamples: (samples: Sample[]) => void
  addSampleImage: (sampleId: number, image: SampleImage) => void
  removeSampleImage: (sampleId: number, imageUrl: string) => void
}

// ➔ Jetzt mit persist für InformationStore
export const useInformationStore = create<InformationState>()(
  persist(
    (set) => ({
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
      updateTestSequence: (id, field, value) =>
        set((state) => ({
          testSequences: state.testSequences.map((seq) =>
            seq.id === id ? { ...seq, [field]: value } : seq
          ),
        })),
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
    }),
    {
      name: "information-storage", // <-- Local Storage key
      partialize: (state) => ({
        fields: state.fields,
        testSequences: state.testSequences,
        samples: state.samples,
      }),
    }
  )
)

type UIState = {
  isMobileSidebarOpen: boolean
  isSearchOpen: boolean
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  openSearch: () => void
  closeSearch: () => void
}

// ➔ Auch UIStore speichern (optional aber nice!)
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileSidebarOpen: false,
      isSearchOpen: false,
      toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
      closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
    }),
    {
      name: "ui-storage",
    }
  )
)
