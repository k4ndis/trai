"use client"

import { useState } from "react"
import { useInformationStore } from "@/lib/store"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import TraiButton from "@/components/ui/TraiButton"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import type { GridRowSelectionModel } from '@mui/x-data-grid'

export function SampleTable() {
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)

  const [selectedSampleIds, setSelectedSampleIds] = useState<number[]>([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const [newSample, setNewSample] = useState({
    productNumber: "",
    productionDate: "",
    serialNumber: "",
    features: "",
  })

  const handleAddSample = () => {
    const id = Date.now()
    const newSampleEntry = {
      id,
      ...newSample,
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
    setSamples(samples.filter((sample) => !selectedSampleIds.includes(sample.id)))
    setSelectedSampleIds([])
    setOpenDeleteConfirm(false)
  }

  const columns = [
    { field: "id", headerName: "No", width: 80 },
    { field: "productNumber", headerName: "Product Number", flex: 1 },
    { field: "productionDate", headerName: "Production Date", flex: 1 },
    { field: "serialNumber", headerName: "Serial Number", flex: 1 },
    { field: "features", headerName: "Features", flex: 1 },
  ]

  return (
    <div className="space-y-4">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold w-full md:w-auto">Samples</h2>

        <div className="flex w-full md:w-auto gap-2 items-center">
          {/* Delete */}
          <Dialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
            <DialogTrigger asChild>
              <TraiButton
                color="error"
                startIcon={<DeleteIcon />}
                disabled={selectedSampleIds.length === 0}
              >
                Delete Selected
              </TraiButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-lg font-bold">Confirm Deletion</DialogHeader>
              <p>Are you sure you want to delete the selected samples?</p>
              <DialogFooter className="mt-4">
                <TraiButton onClick={() => setOpenDeleteConfirm(false)}>
                  Cancel
                </TraiButton>
                <TraiButton color="error" onClick={handleDeleteSelected}>
                  Delete
                </TraiButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add */}
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger>
              <TraiButton startIcon={<AddIcon />}>Add Sample</TraiButton>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Sample</h3>
                <Input placeholder="Product Number" value={newSample.productNumber} onChange={(e) => setNewSample((prev) => ({ ...prev, productNumber: e.target.value }))} />
                <Input placeholder="Production Date" value={newSample.productionDate} onChange={(e) => setNewSample((prev) => ({ ...prev, productionDate: e.target.value }))} />
                <Input placeholder="Serial Number" value={newSample.serialNumber} onChange={(e) => setNewSample((prev) => ({ ...prev, serialNumber: e.target.value }))} />
                <Input placeholder="Features" value={newSample.features} onChange={(e) => setNewSample((prev) => ({ ...prev, features: e.target.value }))} />
                <TraiButton onClick={handleAddSample}>Save Sample</TraiButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* MUI Data Grid */}
      <div className="w-full">
      <DataGrid
        autoHeight
        rows={samples}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        onRowSelectionModelChange={(model) => {
          if (Array.isArray(model)) {
            setSelectedSampleIds(model.map((id) => Number(id)));
          }
        }}
        rowSelectionModel={selectedSampleIds.map(String) as unknown as GridRowSelectionModel}
        slots={{ toolbar: GridToolbar }}
        sx={{
          borderRadius: 2,
          backgroundColor: "background.default",
          color: "text.primary",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "action.hover",
            fontWeight: "bold",
          },
        }}
      />
      </div>
    </div>
  )
}
