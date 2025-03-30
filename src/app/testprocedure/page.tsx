// src/app/testprocedure/page-dropdown.tsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useInformationStore } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TestProcedurePage() {
  const update = useInformationStore((state) => state.updateField)
  const [testType, setTestType] = useState("")
  const [testSequences, setTestSequences] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([])

  const addTestSequence = () => {
    setTestSequences((prev) => [...prev, {
      id: Date.now(),
      type: "Function Test",
      temperatures: [],
      values: "",
      startDate: "",
      endDate: "",
    }])
  }

  const addSample = () => {
    setSamples((prev) => [...prev, {
      id: Date.now(),
      productNumber: "",
      productionDate: "",
      serialNumber: "",
      features: "",
    }])
  }

  const removeItem = (id: number, isSample = false) => {
    if (isSample) setSamples(samples.filter(s => s.id !== id))
    else setTestSequences(testSequences.filter(t => t.id !== id))
  }

  const clearTestType = () => {
    setTestType("")
    update("testtype", "")
  }

  return (
    <div className="space-y-10">
      {/* Test Type Dropdown */}
      <div>
        <Label className="mb-2 block">Test Type</Label>
        <Select
          value={testType}
          onValueChange={(value) => {
            setTestType(value)
            update("testtype", value)
          }}
          disabled={!!testType} // Sperrt das Dropdown wenn etwas gewählt wurde
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Please select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Endurance">Endurance</SelectItem>
            <SelectItem value="Vibration">Vibration</SelectItem>
            <SelectItem value="Aging">Aging</SelectItem>
          </SelectContent>
        </Select>

        {testType && (
          <div className="flex items-center justify-between mt-2 border rounded px-3 py-2 bg-muted text-foreground">
            <span className="text-sm">{testType}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTestType}
              className="text-destructive"
            >
              ❌
            </Button>
          </div>
        )}
      </div>

      {/* Der Rest der Seite bleibt unverändert */}
      {/* Test Sequences */}
      <div className="space-y-4">
        <Label className="text-lg">Test Sequences</Label>
        {testSequences.map((seq, index) => (
          <div key={seq.id} className="border rounded p-4 space-y-2">
            <div className="flex justify-between">
              <strong>TestSequence {index + 1} – {seq.type}</strong>
              <Button variant="destructive" size="sm" onClick={() => removeItem(seq.id)}>✖</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Test Type</Label>
                <select className="w-full border rounded px-2 py-1">
                  <option>Function Test</option>
                  <option>Preaging</option>
                  <option>Durability</option>
                </select>
              </div>
              <div>
                <Label>Temperatures</Label>
                <div className="flex gap-4">
                  {["RT", "-40°C", "+85°C"].map(temp => (
                    <label key={temp} className="flex items-center gap-1">
                      <Checkbox /> {temp}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Values</Label>
                <Input placeholder="pneumatic leak proof, responsiveness..." />
              </div>
              <div className="flex gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addTestSequence}>+ Add Test Sequence</Button>
      </div>

      {/* Samples */}
      <div className="space-y-4">
        <Label className="text-lg">Test Samples</Label>
        {samples.map((sample, index) => (
          <div key={sample.id} className="border rounded p-4 space-y-2">
            <div className="flex justify-between">
              <strong>Sample {index + 1}</strong>
              <Button variant="destructive" size="sm" onClick={() => removeItem(sample.id, true)}>✖</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Product Number" />
              <Input placeholder="Production Date" />
              <Input placeholder="Serial Number" />
              <Textarea placeholder="Features / Deviations" className="col-span-2" />
            </div>
          </div>
        ))}
        <Button onClick={addSample}>+ Add Sample</Button>
      </div>
    </div>
  )
}
