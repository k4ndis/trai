// src/components/SampleTable.tsx
"use client"

import { useState } from "react"
import { useInformationStore } from "@/lib/store"
import { Plus, Filter, ArrowUpDown, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter } from "@/components/ui/dialog"
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

  return (
    <div className="space-y-4">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Samples</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>

          {/* Delete Selected */}
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
                <Button variant="outline" onClick={() => setOpenDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteSelected}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Sample */}
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
                <Input
                  placeholder="Product Number"
                  value={newSample.productNumber}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      productNumber: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Production Date"
                  value={newSample.productionDate}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      productionDate: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Serial Number"
                  value={newSample.serialNumber}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      serialNumber: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Features"
                  value={newSample.features}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      features: e.target.value,
                    }))
                  }
                />
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
              <th className="px-4 py-2">
                <Checkbox
                  checked={selectedSamples.length === samples.length && samples.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSamples(samples.map((sample) => sample.id))
                    } else {
                      setSelectedSamples([])
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-left">Product Number</th>
              <th className="px-4 py-2 text-left">Production Date</th>
              <th className="px-4 py-2 text-left">Serial Number</th>
              <th className="px-4 py-2 text-left">Features</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((sample) => (
              <tr
                key={sample.id}
                className="border-t hover:bg-muted/50"
              >
                <td className="px-4 py-2">
                  <Checkbox
                    checked={selectedSamples.includes(sample.id)}
                    onCheckedChange={() => toggleSelectSample(sample.id)}
                  />
                </td>
                <td className="px-4 py-2">{sample.productNumber}</td>
                <td className="px-4 py-2">{sample.productionDate}</td>
                <td className="px-4 py-2">{sample.serialNumber}</td>
                <td className="px-4 py-2">{sample.features}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
