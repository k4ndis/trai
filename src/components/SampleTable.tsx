"use client"

import { useState } from "react"
import { useInformationStore } from "@/lib/store"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import TraiButton from "@/components/ui/TraiButton"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table"
import type { Sample } from "@/lib/store"

export function SampleTable() {
  const samples = useInformationStore((state) => state.samples)
  const setSamples = useInformationStore((state) => state.setSamples)

  const [openAdd, setOpenAdd] = useState(false)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const [newSample, setNewSample] = useState({
    productNumber: "",
    productionDate: "",
    serialNumber: "",
    features: "",
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const selectedIds = Object.keys(rowSelection).map(Number)

  const handleAddSample = () => {
    const id = Date.now()
    setSamples([
      ...samples,
      { id, ...newSample, images: [] }
    ])
    setNewSample({ productNumber: "", productionDate: "", serialNumber: "", features: "" })
    setOpenAdd(false)
  }

  const handleDeleteSelected = () => {
    setSamples(samples.filter(sample => !selectedIds.includes(sample.id)))
    setRowSelection({})
    setOpenDeleteConfirm(false)
  }

  const columns: ColumnDef<Sample>[] = [
    {
      id: "select",
      header: () => <input
        type="checkbox"
        checked={Object.keys(rowSelection).length === samples.length}
        onChange={(e) => {
          const checked = e.target.checked
          const newSelection = samples.reduce((acc, sample) => {
            acc[sample.id] = checked
            return acc
          }, {} as RowSelectionState)
          setRowSelection(checked ? newSelection : {})
        }}
      />,
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: "id",
      header: "No",
      cell: info => info.row.index + 1,
    },
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
  ]

  const table = useReactTable({
    data: samples,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  })

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
                disabled={selectedIds.length === 0}
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

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t hover:bg-muted/50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
