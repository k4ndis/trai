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
import { X } from "lucide-react"

export default function TestProcedurePage() {
  const update = useInformationStore((state) => state.updateField)
  const [testType, setTestType] = useState("")
  const [testSequences, setTestSequences] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([])

  const addTestSequence = () => {
    setTestSequences((prev) => [...prev, {
      id: Date.now(),
      type: "",
      temperatures: [],
      values: [],
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
        <Label className="text-lg mb-2 block">Test Type</Label>
        <Select
          value={testType}
          onValueChange={(value) => {
            setTestType(value)
            update("testtype", value)
          }}
          disabled={!!testType}
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

        {testType && (
          <div className="flex gap-2 items-center mt-2">
            <div className="px-3 py-1 bg-muted text-sm rounded flex items-center">
              {testType}
              <button
                onClick={clearTestType}
                className="ml-2 text-destructive hover:underline"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

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
              <div className="col-span-2">
                <Label className="mb-1 block">Test Type</Label>
                <Select
                  value={seq.type}
                  onValueChange={(value) => {
                    setTestSequences((prev) =>
                      prev.map((s) =>
                        s.id === seq.id ? { ...s, type: value } : s
                      )
                    )
                  }}
                  disabled={!!seq.type}
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

                {seq.type && (
                  <div className="flex gap-2 items-center mt-2">
                    <div className="px-3 py-1 bg-muted text-sm rounded flex items-center">
                      {seq.type}
                      <button
                        onClick={() => {
                          setTestSequences((prev) =>
                            prev.map((s) =>
                              s.id === seq.id ? { ...s, type: "" } : s
                            )
                          )
                        }}
                        className="ml-2 text-destructive hover:underline"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Label className="mb-1 block">Temperatures</Label>
                  <div className="flex gap-4">
                    {["RT", "-40°C", "+85°C"].map(temp => (
                      <label key={temp} className="flex items-center gap-1">
                        <Checkbox
                          checked={seq.temperatures.includes(temp)}
                          disabled={seq.temperatures.includes(temp)}
                          onCheckedChange={() => {
                            setTestSequences((prev) =>
                              prev.map((s) =>
                                s.id === seq.id
                                  ? { ...s, temperatures: [...s.temperatures, temp] }
                                  : s
                              )
                            )
                          }}
                        /> {temp}
                      </label>
                    ))}
                  </div>
                  {seq.temperatures.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {seq.temperatures.map((temp: string) => (
                        <div key={temp} className="px-3 py-1 bg-muted text-sm rounded flex items-center">
                          {temp}
                          <button
                            onClick={() => {
                              setTestSequences((prev) =>
                                prev.map((s) =>
                                  s.id === seq.id
                                    ? { ...s, temperatures: s.temperatures.filter((t: string) => t !== temp) }
                                    : s
                                )
                              )
                            }}
                            className="ml-2 text-destructive hover:underline"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Label className="mb-1 block">Values</Label>
                  <div className="flex gap-4">
                    {["pneumatic leak proof / responsiveness", "characteristic curve / controlling characteristics"].map(val => (
                      <label key={val} className="flex items-center gap-1">
                        <Checkbox
                          checked={seq.values.includes(val)}
                          disabled={seq.values.includes(val)}
                          onCheckedChange={() => {
                            setTestSequences((prev) =>
                              prev.map((s) =>
                                s.id === seq.id
                                  ? { ...s, values: [...s.values, val] }
                                  : s
                              )
                            )
                          }}
                        /> {val}
                      </label>
                    ))}
                  </div>
                  {seq.values.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {seq.values.map((val: string) => (
                        <div key={val} className="px-3 py-1 bg-muted text-sm rounded flex items-center">
                          {val}
                          <button
                            onClick={() => {
                              setTestSequences((prev) =>
                                prev.map((s) =>
                                  s.id === seq.id
                                    ? { ...s, values: s.values.filter((v: string) => v !== val) }
                                    : s
                                )
                              )
                            }}
                            className="ml-2 text-destructive hover:underline"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex gap-4">
                  <div>
                    <Label className="mb-1 block">Start Date</Label>
                    <Input
                      type="date"
                      className="w-40"
                      value={seq.startDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTestSequences((prev) =>
                          prev.map((s) =>
                            s.id === seq.id ? { ...s, startDate: value } : s
                          )
                        );
                      }}
                      disabled={!!seq.startDate}
                    />
                    {seq.startDate && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <div className="px-3 py-1 bg-muted text-sm rounded flex items-center">
                          {seq.startDate}
                          <button
                            onClick={() => {
                              setTestSequences((prev) =>
                                prev.map((s) =>
                                  s.id === seq.id ? { ...s, startDate: "" } : s
                                )
                              );
                            }}
                            className="ml-2 text-destructive hover:underline"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-1 block">End Date</Label>
                    <Input
                      type="date"
                      className="w-40"
                      value={seq.endDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTestSequences((prev) =>
                          prev.map((s) =>
                            s.id === seq.id ? { ...s, endDate: value } : s
                          )
                        );
                      }}
                      disabled={!!seq.endDate}
                    />
                    {seq.endDate && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <div className="px-3 py-1 bg-muted text-sm rounded flex items-center">
                          {seq.endDate}
                          <button
                            onClick={() => {
                              setTestSequences((prev) =>
                                prev.map((s) =>
                                  s.id === seq.id ? { ...s, endDate: "" } : s
                                )
                              );
                            }}
                            className="ml-2 text-destructive hover:underline"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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