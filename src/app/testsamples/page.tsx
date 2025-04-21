// src/app/testsamples/page.tsx
"use client"

import { SampleSection } from "@/app/testprocedure/SampleSection"
import { useInformationStore } from "@/lib/store"
import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function TestSamplesPage() {
  const fields = useInformationStore((state) => state.fields)
  const updateMultipleFields = useInformationStore((state) => state.updateMultipleFields)
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)

  useEffect(() => {
    const loadData = async () => {
      const reportId = fields.report
      if (!reportId) return

      const { data, error } = await supabase
        .from("test_reports")
        .select("*")
        .eq("id", reportId)
        .single()

      if (error) {
        console.error("Ladefehler:", error)
        return
      }

      if (data) {
        updateMultipleFields(data.fields || {})
        setSamples(data.test_samples || [])
      }
    }

    loadData()
  }, [fields.report, setSamples, updateMultipleFields])

  const addSample = () => {
    setSamples([
      ...samples,
      {
        id: Date.now(),
        productNumber: "",
        productionDate: "",
        serialNumber: "",
        features: "",
      },
    ])
  }

  const updateSample = (id: number, field: keyof Sample, value: string) => {
    const updated = samples.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    )
    setSamples(updated)
  }

  const removeItem = (id: number, isSample = false) => {
    if (isSample) {
      setSamples(samples.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="space-y-10">
      <SampleSection
        samples={samples}
        updateSample={updateSample}
        addSample={addSample}
        removeItem={removeItem}
      />
    </div>
  )
}
