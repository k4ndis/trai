// src/components/SampleTable.tsx
"use client"

import { useState } from "react"
import { useInformationStore } from "@/lib/store"
import { Plus, Trash2, ArrowDown, ArrowUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Sample } from "@/lib/store"

export function SampleTable() {
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)
  const [selectedSamples, setSelectedSamples] = useState<number[]>([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const [newSample, setNewSample] = useState({
    productNumber: "",
    productionDate: "",
    serialNumber: "",
    features: "",
  })
  const [editingSampleId, setEditingSampleId] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [sortField, setSortField] = useState<keyof Sample | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSelectSample = (id: number) => {
    setSelectedSamples((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleAddSample = () => {
    const id = Date.now()
    const newSampleEntry: Sample = {
      id,
      productNumber: newSample.productNumber,
      productionDate: newSample.productionDate,
      serialNumber: newSample.serialNumber,
      features: newSample.features,
      images: [],
    }
    setSamples([...samples, newSampleEntry])
    setNewSample({
      productNumber: "",
      productionDate: "",
      serialNumber: "",
      features: "",
    })
    setOpenAdd(false)
  }

  const handleDeleteSelected = () => {
    setSamples(samples.filter((sample) => !selectedSamples.includes(sample.id)))
    setSelectedSamples([])
    setOpenDeleteConfirm(false)
  }

  const startEditing = (id: number, field: keyof Sample, value: string) => {
    setEditingSampleId(id)
    setEditingField(field)
    setEditingValue(value)
  }

  const saveEdit = () => {
    if (editingSampleId !== null && editingField !== null) {
      const updatedSamples = samples.map((sample) =>
        sample.id === editingSampleId
          ? { ...sample, [editingField]: editingValue }
          : sample
      )
      setSamples(updatedSamples)
    }
    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingSampleId(null)
    setEditingField(null)
    setEditingValue("")
  }

  const handleSort = (field: keyof Sample) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedSamples = [...samples]
    .filter((sample) =>
      Object.values(sample)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = (a[sortField] || "").toString()
      const bValue = (b[sortField] || "").toString()
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  return (
    <div className="space-y-4">
      {/* Topbar */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-2xl font-bold">Samples</h2>
        <div className="flex flex-wrap gap-2 items-center justify-end">
          <Input
            placeholder="Search samples..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={selectedSamples.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-lg font-bold">Confirm Deletion</DialogHeader>
              <p>Are you sure you want to delete the selected samples?</p>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteSelected}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Sample
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Sample</h3>
                <Input placeholder="Product Number" value={newSample.productNumber} onChange={(e) => setNewSample((prev) => ({ ...prev, productNumber: e.target.value }))} />
                <Input placeholder="Production Date" value={newSample.productionDate} onChange={(e) => setNewSample((prev) => ({ ...prev, productionDate: e.target.value }))} />
                <Input placeholder="Serial Number" value={newSample.serialNumber} onChange={(e) => setNewSample((prev) => ({ ...prev, serialNumber: e.target.value }))} />
                <Input placeholder="Features" value={newSample.features} onChange={(e) => setNewSample((prev) => ({ ...prev, features: e.target.value }))} />
                <Button onClick={handleAddSample}>Save Sample</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-2 py-2 w-8">
                <Checkbox
                  checked={selectedSamples.length === samples.length && samples.length > 0}
                  onCheckedChange={(checked) => {
                    setSelectedSamples(checked ? samples.map((s) => s.id) : [])
                  }}
                />
              </th>
              <th className="px-2 py-2 w-8 cursor-pointer" onClick={() => handleSort("id")}>
                <span className="flex items-center gap-1">
                  ID
                  {sortField === "id" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </span>
              </th>
              {(["productNumber", "productionDate", "serialNumber", "features"] as const).map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                >
                  <span className="flex items-center gap-1">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    {sortField === field &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedSamples.map((sample, index) => (
              <tr key={sample.id} className="border-t hover:bg-muted/50">
                <td className="px-2">
                  <Checkbox
                    checked={selectedSamples.includes(sample.id)}
                    onCheckedChange={() => toggleSelectSample(sample.id)}
                  />
                </td>
                <td className="px-2 text-muted-foreground">{sample.id}</td>
                {(["productNumber", "productionDate", "serialNumber", "features"] as const).map((field) => (
                  <td
                    key={field}
                    className="px-4 py-2"
                    onClick={() => startEditing(sample.id, field, sample[field]?.toString() ?? "")}
                  >
                    {editingSampleId === sample.id && editingField === field ? (
                      <div className="space-y-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          autoFocus
                          className="text-xs"
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        />
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" onClick={saveEdit}>Save changes</Button>
                          <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      sample[field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
