// src/lib/store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Session } from "@supabase/supabase-js"

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
  sampleState: string
  features: string
  images: SampleImage[]
}

interface InformationState {
  fields: InformationFields
  testSequences: TestSequence[]
  samples: Sample[]
  updateField: (fieldId: string, value: string) => void
  updateMultipleFields: (newFields: InformationFields) => void
  setFields: (newFields: InformationFields) => void
  setTestSequences: (sequences: TestSequence[]) => void
  updateTestSequence: (
    id: number,
    field: keyof TestSequence,
    value: string | number | string[] | number[]
  ) => void
  setSamples: (samples: Sample[]) => void
  addSample: () => void // ✅ NEU eingefügt
  addSampleImage: (sampleId: number, image: SampleImage) => void
  removeSampleImage: (sampleId: number, imageUrl: string) => void
  clearFields: () => void
  clearSamples: () => void
  clearTestSequences: () => void
}

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
      setFields: (newFields) =>
        set(() => ({
          fields: { ...newFields },
        })),
      setTestSequences: (sequences) => set({ testSequences: sequences }),
      updateTestSequence: (id, field, value) =>
        set((state) => ({
          testSequences: state.testSequences.map((seq) =>
            seq.id === id ? { ...seq, [field]: value } : seq
          ),
        })),
      setSamples: (samples) => set({ samples }),
      
      // ✅ NEU: addSample Funktion
      addSample: () =>
        set((state) => ({
          samples: [
            ...state.samples,
            {
              id: Date.now(),
              productNumber: "",
              productionDate: "",
              serialNumber: "",
              sampleState: "",
              features: "",
              images: [],
            },
          ],
        })),

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
      clearFields: () => set({ fields: {} }),
      clearSamples: () => set({ samples: [] }),
      clearTestSequences: () => set({ testSequences: [] }),
    }),
    {
      name: "information-store",
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

export const useUIStore = create<UIState>((set) => ({
  isMobileSidebarOpen: false,
  isSearchOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}))

type AuthState = {
  session: Session | null
  setSession: (session: Session | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: "auth-store", // Wird in localStorage gespeichert
    }
  )
)
