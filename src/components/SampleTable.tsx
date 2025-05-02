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
import { useInformationStore } from "@/lib/store"
import { Dialog, DialogContent as ShadDialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Sample } from "@/lib/store"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import ImageUploader from "@/components/image"


export function SampleTable() {
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
  const [activeSample, setActiveSample] = useState<Sample | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageUploadSampleId, setImageUploadSampleId] = useState<number | null>(null)

  const handleOpenModal = (mode: "create" | "edit", sample?: Sample) => {
    setModalMode(mode)
    setActiveSample(sample ?? {
      id: Date.now(),
      productNumber: "",
      productionDate: "",
      serialNumber: "",
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
      setSamples(
        samples.map((s) => (s.id === activeSample.id ? activeSample : s))
      )
    }
    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this sample?")
    if (confirm) setSamples(samples.filter((s) => s.id !== id))
  }

  const columns = useMemo<MRT_ColumnDef<Sample>[]>(() => [
    {
      accessorKey: "productNumber",
      header: "Product Number",
    },
    {
      accessorKey: "productionDate",
      header: "Production Date",
    },
    {
      accessorKey: "serialNumber",
      header: "Serial Number",
    },
    {
      accessorKey: "features",
      header: "Features",
    },
    {
      header: "Images",
      Cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.images?.length || 0} 📷
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
        <Tooltip title="Upload Image">
          <IconButton
            color="primary"
            onClick={() => setImageUploadSampleId(row.original.id)}
          >
            <CameraAltIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),    
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal("create")}
      >
        Add Sample
      </Button>
    ),
    muiTableContainerProps: {
      sx: { minHeight: "400px", borderRadius: 2 },
    },
  })

  return (
    <>
      <MaterialReactTable table={table} />

      {/* Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ShadDialogContent className="max-w-lg">
          <DialogTitle>
            {modalMode === "create" ? "Add New Sample" : "Edit Sample"}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: 1 }}>
            <TextField
              label="Product Number"
              value={activeSample?.productNumber ?? ""}
              onChange={(e) =>
                setActiveSample((prev) =>
                  prev ? { ...prev, productNumber: e.target.value } : prev
                )
              }
            />
            <TextField
              label="Production Date"
              value={activeSample?.productionDate ?? ""}
              onChange={(e) =>
                setActiveSample((prev) =>
                  prev ? { ...prev, productionDate: e.target.value } : prev
                )
              }
            />
            <TextField
              label="Serial Number"
              value={activeSample?.serialNumber ?? ""}
              onChange={(e) =>
                setActiveSample((prev) =>
                  prev ? { ...prev, serialNumber: e.target.value } : prev
                )
              }
            />
            <TextField
              label="Features"
              value={activeSample?.features ?? ""}
              onChange={(e) =>
                setActiveSample((prev) =>
                  prev ? { ...prev, features: e.target.value } : prev
                )
              }
            />
            <Label className="text-sm text-muted-foreground">
              Sample Image Upload (kommt später)
            </Label>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </DialogActions>
        </ShadDialogContent>
      </Dialog>

      {/* Modal für Bild-Upload */}
      <Dialog open={!!imageUploadSampleId} onOpenChange={() => setImageUploadSampleId(null)}>
        <ShadDialogContent className="max-w-3xl">
          <DialogTitle>Upload Sample Image</DialogTitle>
          <DialogContent>
            {imageUploadSampleId && (
              <ImageUploader
                sampleId={imageUploadSampleId}
                onUpload={(url, label) => {
                  const updatedSamples = samples.map((sample) =>
                    sample.id === imageUploadSampleId
                      ? {
                          ...sample,
                          images: [
                            ...(sample.images || []),
                            { url, label },
                          ],
                        }
                      : sample
                  )
                  setSamples(updatedSamples)
                  setImageUploadSampleId(null)
                }}              
               
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImageUploadSampleId(null)}>Close</Button>
          </DialogActions>
        </ShadDialogContent>
      </Dialog>

    </>
  )
}
