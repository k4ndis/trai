"use client"

import { useMemo, useState } from "react"
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import Autocomplete from "@mui/material/Autocomplete"
import { useInformationStore } from "@/lib/store"
import { Dialog, DialogContent as ShadDialogContent } from "@/components/ui/dialog"
import type { Sample } from "@/lib/store"
import ImageGalleryDialog from "@/components/ImageGalleryDialog"

export function SampleTable() {
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
  const [activeSample, setActiveSample] = useState<Sample | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageGallerySample, setImageGallerySample] = useState<Sample | null>(null)

  const handleOpenModal = (mode: "create" | "edit", sample?: Sample) => {
    setModalMode(mode)
    setActiveSample(sample ?? {
      id: samples.length > 0 ? Math.max(...samples.map(s => s.id)) + 1 : 1,
      productNumber: "",
      productionDate: "",
      serialNumber: "",
      sampleState: "",
      features: "",
      images: [],
    })
    setDialogOpen(true)
  }

  const handleCloseModal = () => {
    setModalMode(null)
    setActiveSample(null)
    setDialogOpen(false)
  }

  const handleSave = () => {
    if (!activeSample) return
    if (modalMode === "create") {
      setSamples([...samples, activeSample])
    } else {
      setSamples(samples.map((s) => (s.id === activeSample.id ? activeSample : s)))
    }
    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this sample?")
    if (confirm) setSamples(samples.filter((s) => s.id !== id))
  }

  const columns = useMemo<MRT_ColumnDef<Sample>[]>(() => [
    { accessorKey: "id", header: "ID", enableEditing: false },
    { accessorKey: "productNumber", header: "Product Number" },
    { accessorKey: "productionDate", header: "Production Date" },
    { accessorKey: "serialNumber", header: "Serial Number" },
    { accessorKey: "sampleState", header: "Sample State" },
    { accessorKey: "features", header: "Features" },
    {
      header: "Images",
      Cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.images?.length || 0}
        </span>
      ),
    },
  ], [])

  const table = useMaterialReactTable({
    columns,
    data: samples,
    enableRowSelection: true,
    enableEditing: true,
    editDisplayMode: "modal",
    createDisplayMode: "modal",
    getRowId: (row) => row.id.toString(),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => handleOpenModal("edit", row.original)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Manage Images">
          <IconButton
            color="primary"
            onClick={() => setImageGallerySample(row.original)}
          >
            <CameraAltIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("create")}>
        Add Sample
      </Button>
    ),
    muiTableContainerProps: { sx: { minHeight: "400px", borderRadius: 2 } },
  })

  return (
    <>
      <MaterialReactTable table={table} />

      {/* Create/Edit Sample */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ShadDialogContent className="max-w-lg">
          <DialogTitle>
            {modalMode === "create" ? "Add New Sample" : "Edit Sample"}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: 1 }}>
            <TextField label="Product Number" value={activeSample?.productNumber ?? ""} onChange={(e) => setActiveSample((prev) => prev ? { ...prev, productNumber: e.target.value } : prev)} />
            <TextField label="Production Date" value={activeSample?.productionDate ?? ""} onChange={(e) => setActiveSample((prev) => prev ? { ...prev, productionDate: e.target.value } : prev)} />
            <TextField label="Serial Number" value={activeSample?.serialNumber ?? ""} onChange={(e) => setActiveSample((prev) => prev ? { ...prev, serialNumber: e.target.value } : prev)} />
            <Autocomplete
              freeSolo
              options={["A", "B", "C", "S"]}
              value={activeSample?.sampleState ?? ""}
              onChange={(_, newValue) =>
                setActiveSample((prev) => prev ? { ...prev, sampleState: newValue ?? "" } : prev)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sample State"
                  onChange={(e) =>
                    setActiveSample((prev) => prev ? { ...prev, sampleState: e.target.value } : prev)
                  }
                />
              )}
            />
            <TextField label="Features" value={activeSample?.features ?? ""} onChange={(e) => setActiveSample((prev) => prev ? { ...prev, features: e.target.value } : prev)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </ShadDialogContent>
      </Dialog>

      {/* Galerie-Dialog mit Filerobot */}
      {imageGallerySample && (
        <ImageGalleryDialog
          sample={imageGallerySample}
          open={!!imageGallerySample}
          onClose={() => setImageGallerySample(null)}
          onUpdate={(updated) => {
            setSamples(samples.map((s) =>
              s.id === updated.id ? { ...s, images: updated.images ?? [] } : s
            ))
            
            setImageGallerySample((prev) =>
              prev ? { ...prev, images: updated.images ?? [] } : null
            )            
          }}          
        />
      )}
    </>
  )
}
