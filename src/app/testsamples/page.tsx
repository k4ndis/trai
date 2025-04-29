// src/app/testsamples/page.tsx
"use client"

import { SampleSection } from "@/app/testprocedure/SampleSection"
import { useInformationStore } from "@/lib/store"
import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function TestSamplesPage() {
  const fields = useInformationStore((state) => state.fields)
  const updateMultipleFields = useInformationStore((state) => state.updateMultipleFields)
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

  return (
    <div className="space-y-10">
      <SampleSection />
    </div>
  )
}
