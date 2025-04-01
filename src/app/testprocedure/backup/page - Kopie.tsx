// src/app/testprocedure/page.tsx
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
      mode: [],
      startDate: "",
      endDate: "",
      testbench: "",
      cycles: "",
      temperature: "",
      dwelltime: "",
      comment: ""
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
        {!testType && (
          <Select
            value={testType}
            onValueChange={(value) => {
              setTestType(value)
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
            {testSequences.some(seq => seq.type === "Durability") && (
  <div className="text-sm text-muted-foreground mt-2">
    Total Durability Cycles: {
      testSequences
        .filter(seq => seq.type === "Durability")
        .reduce((sum, seq) => sum + (parseInt(seq.cycles) || 0), 0)
    }
  </div>
)}

          </Select>
        )}

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
              <strong>TestSequence {index + 1} {seq.type && `– ${seq.type}`}</strong>
              <Button variant="destructive" size="sm" onClick={() => removeItem(seq.id)}>✖</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="mb-1 block">Test Type</Label>
                {!seq.type && (
                  <Select
                    value={seq.type}
                    onValueChange={(value) => {
                      setTestSequences((prev) =>
                        prev.map((s) =>
                          s.id === seq.id ? { ...s, type: value } : s
                        )
                      )
                    }}
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

                {seq.type === "Function Test" && (
                  <>
                    {/* Function Test Fields */}
                    <div className="mt-4">
                      <Label className="mb-1 block">Temperatures</Label>
                      <div className="flex gap-4 flex-wrap">
                        {[
                          "RT",
                          "-40°C",
                          "+85°C"
                        ].map(temp => (
                          !seq.temperatures.includes(temp) && (
                            <label key={temp} className="flex items-center gap-1">
                              <Checkbox
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
                          )
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
                      <div className="flex gap-4 flex-wrap">
                        {[
                          "pneumatic leak proof / responsiveness",
                          "characteristic curve / controlling characteristics"
                        ].map(val => (
                          !seq.values.includes(val) && (
                            <label key={val} className="flex items-center gap-1">
                              <Checkbox
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
                          )
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
                                      s.id === seq.id ? { ...s, values: s.values.filter((v: string) => v !== val) } : s
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

                    <div className="flex gap-4 mt-4">
                      <div>
                        <Label className="mb-1 block">Start Date</Label>
                        {!seq.startDate && (
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
                          />
                        )}
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
                        {!seq.endDate && (
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
                          />
                        )}
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
                  </>
                )}

                {seq.type === "Preaging" && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      placeholder="Testbench"
                      value={seq.testbench}
                      onChange={(e) => setTestSequences((prev) =>
                        prev.map((s) => s.id === seq.id ? { ...s, testbench: e.target.value } : s))}
                    />
                    <Input
                      placeholder="Cycles"
                      value={seq.cycles}
                      onChange={(e) => setTestSequences((prev) =>
                        prev.map((s) => s.id === seq.id ? { ...s, cycles: e.target.value } : s))}
                    />
                    <Input
                      placeholder="Temperature"
                      value={seq.temperature}
                      onChange={(e) => setTestSequences((prev) =>
                        prev.map((s) => s.id === seq.id ? { ...s, temperature: e.target.value } : s))}
                    />
                    <Input
                      placeholder="Dwell Time"
                      value={seq.dwelltime}
                      onChange={(e) => setTestSequences((prev) =>
                        prev.map((s) => s.id === seq.id ? { ...s, dwelltime: e.target.value } : s))}
                    />
                    <Textarea
                      placeholder="Comment"
                      className="col-span-2"
                      value={seq.comment}
                      onChange={(e) => setTestSequences((prev) =>
                        prev.map((s) => s.id === seq.id ? { ...s, comment: e.target.value } : s))}
                    />
                  </div>
                )}

{seq.type === "Durability" && (
  <>
    {/* Durability: Temperaturen */}
    <div className="mt-4">
      <Label className="mb-1 block">Temperatures</Label>
      <div className="flex gap-4 flex-wrap">
        {["RT", "-40°C", "+85°C"].map(temp => (
          !seq.temperatures.includes(temp) && (
            <label key={temp} className="flex items-center gap-1">
              <Checkbox
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
          )
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

    {/* Durability: Mode */}
    <div className="mt-4">
      <Label className="mb-1 block">Mode</Label>
      <div className="flex gap-4 flex-wrap">
        {["Normal", "HAD"].map(mode => (
          !seq.mode.includes(mode) && (
            <label key={mode} className="flex items-center gap-1">
              <Checkbox
                onCheckedChange={() => {
                  setTestSequences((prev) =>
                    prev.map((s) =>
                      s.id === seq.id
                        ? { ...s, mode: [...s.mode, mode] }
                        : s
                    )
                  )
                }}
              /> {mode}
            </label>
          )
        ))}
      </div>
      {seq.mode.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {seq.mode.map((mode: string) => (
            <div key={mode} className="px-3 py-1 bg-muted text-sm rounded flex items-center">
              {mode}
              <button
                onClick={() => {
                  setTestSequences((prev) =>
                    prev.map((s) =>
                      s.id === seq.id
                        ? { ...s, mode: s.mode.filter((m: string) => m !== mode) }
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

    {/* Durability: Cycles */}
    <div className="mt-4">
      <Label className="mb-1 block">Cycles</Label>
      <Input
        type="number"
        placeholder="Enter number of cycles"
        value={seq.cycles}
        onChange={(e) => {
          const value = e.target.value;
          setTestSequences((prev) =>
            prev.map((s) =>
              s.id === seq.id
                ? { ...s, cycles: value }
                : s
            )
          )
        }}
      />
    </div>
  </>
)}

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
