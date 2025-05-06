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
import { SnackbarProvider, useSnackbar } from "notistack"

function SampleTableInner() {
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
  const [activeSample, setActiveSample] = useState<Sample | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageGallerySample, setImageGallerySample] = useState<Sample | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [backupSamples, setBackupSamples] = useState<Sample[] | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  const { enqueueSnackbar } = useSnackbar()

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
    setBackupSamples(samples)
    const updated = samples.filter((s) => s.id !== id)
    setSamples(updated)
    enqueueSnackbar("Sample deleted", {
      action: () => (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            if (backupSamples) {
              setSamples(backupSamples)
              setBackupSamples(null)
              enqueueSnackbar("Undo successful", { variant: "success" })
            }
          }}
        >
          UNDO
        </Button>
      ),
    })
  }
  

  const columns = useMemo<MRT_ColumnDef<Sample>[]>(() => [
    {
      header: "ID",
      Cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableColumnFilter: false,
      size: 50,
    },    
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
        <IconButton
          color="error"
          onClick={() => {
            setDeleteTargetId(row.original.id)
            setConfirmDeleteOpen(true)
          }}
        >
          <DeleteIcon />
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
    renderTopToolbarCustomActions: ({ table }) => {
      const selected = table.getSelectedRowModel().rows
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("create")}>
            Add Sample
          </Button>
          {selected.length > 0 && (
            <Button variant="outlined" color="error" onClick={() => setConfirmDeleteOpen(true)}>
              Delete Selection
            </Button>
          )}
        </Box>
      )
    },
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

      {/* Delete Selection Confirmation */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <ShadDialogContent className="max-w-md">
          <DialogTitle>Delete selected samples?</DialogTitle>
          <DialogContent>
            This will permanently delete {table.getSelectedRowModel().rows.length} sample(s).
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                const idsToDelete =
                  deleteTargetId !== null
                    ? [deleteTargetId]
                    : table.getSelectedRowModel().rows.map((r) => r.original.id)

                const updated = samples.filter((s) => !idsToDelete.includes(s.id))
                setBackupSamples(samples)
                setSamples(updated)
                setConfirmDeleteOpen(false)
                setDeleteTargetId(null)
                table.resetRowSelection()

                enqueueSnackbar(`${idsToDelete.length} sample(s) deleted`, {
                  action: () => (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => {
                        if (backupSamples) {
                          setSamples(backupSamples)
                          setBackupSamples(null)
                          enqueueSnackbar("Undo successful", { variant: "success" })
                        }
                      }}
                    >
                      UNDO
                    </Button>
                  ),
                })
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </ShadDialogContent>
      </Dialog>

      {/* Galerie-Dialog */}
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

export function SampleTable() {
  return (
    <SnackbarProvider maxSnack={3}>
      <SampleTableInner />
    </SnackbarProvider>
  )
}
