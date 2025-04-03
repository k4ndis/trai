// src/app/testprocedure/page.tsx
"use client"

import { useState, useMemo } from "react"
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
import { SampleSection } from "./SampleSection"


// Typdefinitionen
interface TestSequence {
  id: number;
  type: string;
  temperatures: string[];
  values: string[];
  mode: string[];
  startDate: string;
  endDate: string;
  testbench: string;
  cycles: string;
  temperature: string;
  dwelltime: string;
  comment: string;
}

interface Sample {
  id: number;
  productNumber: string;
  productionDate: string;
  serialNumber: string;
  features: string;
}

// Wiederverwendbare CheckboxGroup-Komponente
function CheckboxGroup({
  title,
  options,
  selected,
  onAdd,
  onRemove,
}: {
  title: string;
  options: string[];
  selected: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
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
  );
}


// DateInputWithTag-Komponente
function DateInputWithTag({
  label,
  value,
  onChange,
  onClear
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      {!value && (
        <Input
          type="date"
          className="w-40"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {value && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <div className="px-3 py-1 bg-muted text-sm rounded flex items-center">
            {value}
            <button
              onClick={onClear}
              className="ml-2 text-destructive hover:underline"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestProcedurePage() {
  const update = useInformationStore((state) => state.updateField)
  const [testType, setTestType] = useState("")
  const [testSequences, setTestSequences] = useState<TestSequence[]>([]);
  const [samples, setSamples] = useState<Sample[]>([])

  // Memoized calculation of total durability cycles
  const totalDurabilityCycles = useMemo(() => {
    return testSequences
      .filter(seq => seq.type === "Durability")
      .reduce((sum, seq) => sum + (parseInt(seq.cycles) || 0), 0);
  }, [testSequences]);

  // Helper function to update a test sequence
  const updateTestSequence = (id: number, field: keyof TestSequence, value: any) => {
    setTestSequences((prev) =>
      prev.map((seq) =>
        seq.id === id ? { ...seq, [field]: value } : seq
      )
    );
  };

  // Helper function to update a sample
  const updateSample = (id: number, field: keyof Sample, value: string) => {
    setSamples((prev) =>
      prev.map((sample) =>
        sample.id === id ? { ...sample, [field]: value } : sample
      )
    );
  };

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

  // Helper function to add item to an array field in a test sequence
  const addItemToSequence = (seqId: number, field: "temperatures" | "values" | "mode", item: string) => {
    setTestSequences((prev) =>
      prev.map((seq) =>
        seq.id === seqId ? { ...seq, [field]: [...seq[field], item] } : seq
      )
    );
  };

  // Helper function to remove item from an array field in a test sequence
  const removeItemFromSequence = (seqId: number, field: "temperatures" | "values" | "mode", item: string) => {
    setTestSequences((prev) =>
      prev.map((seq) =>
        seq.id === seqId ? { ...seq, [field]: seq[field].filter((i) => i !== item) } : seq
      )
    );
  };

  return (
    <div className="space-y-10">
      {/* Test Type Dropdown */}
      
      <div
        id="testtype"
        tabIndex={-1}
        className="border border-gray-700 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
      >
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


      {/* Test Sequences */}
      <div
        id="testsequence"
        tabIndex={-1}
        className="border border-gray-700 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
      >
        <Label className="text-lg">Test Sequences</Label>
        {testSequences.map((seq, index) => (
          <div key={seq.id} className="border rounded p-4 space-y-2">
            <div className="flex justify-between">
            <strong className="text-blue-400 text-lg">
              Sequence {index + 1} {seq.type && `– ${seq.type}`}
            </strong>

              <Button variant="destructive" size="sm" onClick={() => removeItem(seq.id)}>✖</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                
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
                          <X className="w-4 h-4" />
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
                  <div className="flex flex-wrap gap-6 mt-4 items-start">
                    {/* Temperatures */}
                    <div className="min-w-[230px] flex-shrink-0">
                      <Label className="mb-1 block">Temperatures</Label>
                      <CheckboxGroup
                        title=""
                        options={["RT", "-40°C", "+85°C"]}
                        selected={seq.temperatures}
                        onAdd={(temp) => addItemToSequence(seq.id, "temperatures", temp)}
                        onRemove={(temp) => removeItemFromSequence(seq.id, "temperatures", temp)}
                      />
                    </div>

                    {/* Values */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Label className="mb-1 block">Values</Label>
                      <CheckboxGroup
                        title=""
                        options={[
                          "pneumatic leak proof / responsiveness",
                          "characteristic curve / controlling characteristics"
                        ]}
                        selected={seq.values}
                        onAdd={(val) => addItemToSequence(seq.id, "values", val)}
                        onRemove={(val) => removeItemFromSequence(seq.id, "values", val)}
                      />
                    </div>

                    {/* Start Date */}
                    <div className="min-w-[200px]">
                      <DateInputWithTag
                        label="Start Date"
                        value={seq.startDate}
                        onChange={(value) => updateTestSequence(seq.id, "startDate", value)}
                        onClear={() => updateTestSequence(seq.id, "startDate", "")}
                      />
                    </div>

                    {/* End Date */}
                    <div className="min-w-[200px]">
                      <DateInputWithTag
                        label="End Date"
                        value={seq.endDate}
                        onChange={(value) => updateTestSequence(seq.id, "endDate", value)}
                        onClear={() => updateTestSequence(seq.id, "endDate", "")}
                      />
                    </div>
                  </div>
                )}

                {seq.type === "Preaging" && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      placeholder="Testbench"
                      value={seq.testbench}
                      onChange={(e) => updateTestSequence(seq.id, "testbench", e.target.value)}
                    />
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
                    <Textarea
                      placeholder="Comment"
                      className="col-span-2"
                      value={seq.comment}
                      onChange={(e) => updateTestSequence(seq.id, "comment", e.target.value)}
                    />
                  </div>
                )}

                {seq.type === "Durability" && (
                  <div className="flex flex-wrap gap-6 mt-4 items-start">
                    {/* Temperatures */}
                      <div className="min-w-[230px] flex-shrink-0">
                        <Label className="mb-1 block">Temperatures</Label>
                        <CheckboxGroup
                          title=""
                          options={["RT", "-40°C", "+85°C"]}
                          selected={seq.temperatures}
                          onAdd={(temp) => addItemToSequence(seq.id, "temperatures", temp)}
                          onRemove={(temp) => removeItemFromSequence(seq.id, "temperatures", temp)}
                        />
                      </div>

                    {/* Mode */}
                    <div className="min-w-[200px] flex-shrink-0">
                      <Label className="mb-1 block">Mode</Label>
                      <CheckboxGroup
                        title=""
                        options={["Normal", "HAD"]}
                        selected={seq.mode}
                        onAdd={(mode) => addItemToSequence(seq.id, "mode", mode)}
                        onRemove={(mode) => removeItemFromSequence(seq.id, "mode", mode)}
                      />
                    </div>

                    {/* Cycles */}
                    <div className="min-w-[200px]">
                      <Label className="mb-1 block">Cycles</Label>
                      <Input
                        type="number"
                        placeholder="Enter number of cycles"
                        value={seq.cycles}
                        onChange={(e) => updateTestSequence(seq.id, "cycles", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={addTestSequence}
          className="text-xs px-2 py-1 rounded w-fit"
        >
          + Add Test Sequence
        </Button>
      </div>

      <SampleSection
        samples={samples}
        updateSample={updateSample}
        addSample={addSample}
        removeItem={removeItem}
      />
    </div>
  )
}