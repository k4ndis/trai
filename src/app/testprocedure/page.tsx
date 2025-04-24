"use client"

import { useMemo, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { useInformationStore } from "@/lib/store"
import { supabase } from "@/lib/supabaseClient"

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
  sampleIds: number[]
}

function CheckboxGroup({
  title,
  options,
  selected,
  onAdd,
  onRemove,
}: {
  title?: string
  options: string[]
  selected: string[]
  onAdd: (item: string) => void
  onRemove: (item: string) => void
}) {
  return (
    <div>
      {title && <Label className="mb-1 block">{title}</Label>}
      <div className="flex gap-4 flex-wrap mt-1">
        {options.map(
          (option) =>
            !selected.includes(option) && (
              <label key={option} className="flex items-center gap-1">
                <Checkbox onCheckedChange={() => onAdd(option)} /> {option}
              </label>
            )
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {selected.map((item) => (
            <div
              key={item}
              className="px-3 py-1 bg-muted text-sm rounded flex items-center"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="ml-2 text-destructive hover:underline"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TestProcedurePage() {
  const update = useInformationStore((state) => state.updateField)
  const updateMultipleFields = useInformationStore((state) => state.updateMultipleFields)
  const fields = useInformationStore((state) => state.fields)

  const testType = fields.testtype
  const testSequences = useInformationStore((state) => state.testSequences)
  const setTestSequences = useInformationStore((state) => state.setTestSequences)
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
        setTestSequences(data.test_sequences || [])
        setSamples(data.test_samples || [])
      }
    }

    loadData()
  }, [fields.report, setSamples, setTestSequences, updateMultipleFields])

  const totalDurabilityCycles = useMemo(() => {
    return testSequences
      .filter((seq) => seq.type === "Durability")
      .reduce((sum, seq) => sum + (parseInt(seq.cycles) || 0), 0)
  }, [testSequences])

  const addTestSequence = () => {
    setTestSequences([
      ...testSequences,
      {
        id: Date.now(),
        type: "",
        temperatures: [],
        values: [],
        mode: [],
        startDate: "",
        endDate: "",
        testbench: "",
        cycles: "",
        temperature: "",
        dwelltime: "",
        comment: "",
        sampleIds: [],
      },
    ])
  }

  const updateTestSequence = (
    id: number,
    field: keyof TestSequence,
    value: string | string[] | number
  ) => {
    const updated = testSequences.map((seq) =>
      seq.id === id ? { ...seq, [field]: value } : seq
    )
    setTestSequences(updated)
  }

  const removeItem = (id: number, isSample = false) => {
    if (isSample) {
      setSamples(samples.filter((s) => s.id !== id))
    } else {
      setTestSequences(testSequences.filter((t) => t.id !== id))
    }
  }

  const clearTestType = () => {
    update("testtype", "")
  }

  const addItemToSequence = (
    seqId: number,
    field: "temperatures" | "values" | "mode",
    item: string
  ) => {
    const updated = testSequences.map((seq) =>
      seq.id === seqId ? { ...seq, [field]: [...seq[field], item] } : seq
    )
    setTestSequences(updated)
  }

  const removeItemFromSequence = (
    seqId: number,
    field: "temperatures" | "values" | "mode",
    item: string
  ) => {
    const updated = testSequences.map((seq) =>
      seq.id === seqId
        ? { ...seq, [field]: seq[field].filter((i) => i !== item) }
        : seq
    )
    setTestSequences(updated)
  }

  return (
    <div className="space-y-10">
      <div
        id="testtype"
        tabIndex={-1}
        className="border border-gray-700 rounded-xl p-4 mb-6"
      >
        <Label className="text-lg mb-2 block">Test Type</Label>
        {!testType && (
          <Select
            value={testType}
            onValueChange={(value) => {
              update("testtype", value)
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Please select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Endurance">Endurance</SelectItem>
              <SelectItem value="Vibration">Vibration</SelectItem>
              <SelectItem value="Aging">Aging</SelectItem>
            </SelectContent>
          </Select>
        )}

        {testType && (
          <div className="flex gap-4 items-center mt-2">
            <div className="px-3 py-1 bg-muted text-sm rounded flex items-center">
              {testType}
              <button
                onClick={clearTestType}
                className="ml-2 text-destructive hover:underline"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {testSequences.some(seq => seq.type === "Durability") && (
              <div className="text-sm text-muted-foreground">
                Total Durability Cycles: {totalDurabilityCycles}
              </div>
            )}
          </div>
        )}
      </div>

            <div
        id="testsequence"
        tabIndex={-1}
        className="border border-gray-700 rounded-xl p-4 mb-6"
      >
        <Label className="text-lg">Test Sequences</Label>
        {testSequences.map((seq, index) => (
          <div key={seq.id} className="border rounded p-4 space-y-2 mt-4">
            <div className="flex justify-between">
              <strong className="text-blue-400 text-lg">
                Sequence {index + 1} {seq.type && `– ${seq.type}`}
              </strong>
              <Button variant="destructive" size="sm" onClick={() => removeItem(seq.id)}>
                ✖
              </Button>
            </div>

            {!seq.type && (
              <Select
                value={seq.type}
                onValueChange={(value) => updateTestSequence(seq.id, "type", value)}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Function Test">Function Test</SelectItem>
                  <SelectItem value="Preaging">Preaging</SelectItem>
                  <SelectItem value="Durability">Durability</SelectItem>
                </SelectContent>
              </Select>
            )}

            {seq.type && (
              <div className="flex flex-wrap gap-6 items-center mt-2">
                <div className="flex flex-col">
                  <Label className="mb-1 block">Test Type</Label>
                  <div className="px-3 py-1 bg-muted text-sm rounded flex items-center w-fit">
                    {seq.type}
                    <button
                      onClick={() => updateTestSequence(seq.id, "type", "")}
                      className="ml-2 text-destructive hover:underline"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block">Testbench</Label>
                  <Input
                    placeholder="Enter testbench"
                    value={seq.testbench}
                    onChange={(e) =>
                      updateTestSequence(seq.id, "testbench", e.target.value)
                    }
                    className="w-[200px]"
                  />
                </div>
              </div>
            )}

            {seq.type === "Function Test" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CheckboxGroup
                  options={["RT", "-40°C", "+85°C"]}
                  selected={seq.temperatures}
                  onAdd={(val) => addItemToSequence(seq.id, "temperatures", val)}
                  onRemove={(val) => removeItemFromSequence(seq.id, "temperatures", val)}
                />
                <CheckboxGroup
                  options={[
                    "pneumatic leak proof / responsiveness",
                    "characteristic curve / controlling characteristics",
                  ]}
                  selected={seq.values}
                  onAdd={(val) => addItemToSequence(seq.id, "values", val)}
                  onRemove={(val) => removeItemFromSequence(seq.id, "values", val)}
                />
                <Input
                  type="date"
                  value={seq.startDate}
                  onChange={(e) => updateTestSequence(seq.id, "startDate", e.target.value)}
                />
                <Input
                  type="date"
                  value={seq.endDate}
                  onChange={(e) => updateTestSequence(seq.id, "endDate", e.target.value)}
                />
              </div>
            )}

            {seq.type === "Preaging" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  placeholder="Cycles"
                  value={seq.cycles}
                  onChange={(e) => updateTestSequence(seq.id, "cycles", e.target.value)}
                />
                <Input
                  placeholder="Temperature"
                  value={seq.temperature}
                  onChange={(e) => updateTestSequence(seq.id, "temperature", e.target.value)}
                />
                <Input
                  placeholder="Dwell Time"
                  value={seq.dwelltime}
                  onChange={(e) => updateTestSequence(seq.id, "dwelltime", e.target.value)}
                />
                <Input
                  placeholder="Comment"
                  value={seq.comment}
                  onChange={(e) => updateTestSequence(seq.id, "comment", e.target.value)}
                  className="col-span-2"
                />
              </div>
            )}

            {seq.type === "Durability" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CheckboxGroup
                  options={["RT", "-40°C", "+85°C"]}
                  selected={seq.temperatures}
                  onAdd={(val) => addItemToSequence(seq.id, "temperatures", val)}
                  onRemove={(val) => removeItemFromSequence(seq.id, "temperatures", val)}
                />
                <CheckboxGroup
                  options={["Normal", "HAD"]}
                  selected={seq.mode}
                  onAdd={(val) => addItemToSequence(seq.id, "mode", val)}
                  onRemove={(val) => removeItemFromSequence(seq.id, "mode", val)}
                />
                <Input
                  type="number"
                  value={seq.cycles}
                  onChange={(e) => updateTestSequence(seq.id, "cycles", e.target.value)}
                  className="col-span-2"
                />
              </div>
            )}

            <div className="mt-4">
              <Label className="mb-1 block">Assigned Samples</Label>
              <div className="flex flex-wrap gap-3">
                {samples.map((sample) => {
                  const label = `#${sample.id}_${sample.productNumber}_${sample.productionDate}_${sample.serialNumber}`
                  const isSelected = seq.sampleIds?.includes(sample.id)
                  return (
                    <label key={sample.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => {
                          const updatedIds: number[] = isSelected
                            ? seq.sampleIds.filter((id) => id !== sample.id)
                            : [...(seq.sampleIds || []), sample.id]
                        
                          updateTestSequence(seq.id, "sampleIds", updatedIds)
                        }}
                      />
                      {label}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

        <Button onClick={addTestSequence} className="mt-4">
          + Add Test Sequence
        </Button>
      </div>
    </div>
  )
}
