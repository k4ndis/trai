// src/app/dashboard/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, PencilLine, CheckCircle2, Clock } from "lucide-react"
import { useInformationStore } from "@/lib/store"
import { toast } from "sonner"

interface Report {
  id: string
  fields: {
    project?: string
    product?: string
    status?: string
  }
  created_at: string
}

type FilterOption = "all" | "completed" | "inProgress"

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterOption>("all")
  const router = useRouter()

  const { clearFields, clearSamples, clearTestSequences } = useInformationStore()

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth")
        return
      }

      const { data, error } = await supabase
        .from("test_reports")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        toast.error("Failed to load reports.")
      } else {
        setReports(data as Report[])
        toast.success("Reports loaded!")
      }

      setLoading(false)
    }

    fetchReports()
  }, [router])

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateStr).toLocaleDateString(undefined, options)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return

    const { error } = await supabase
      .from("test_reports")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete report.")
    } else {
      setReports((prev) => prev.filter((r) => r.id !== id))
      toast.success("Report deleted successfully!")
    }
  }

  const handleCreateNew = () => {
    clearFields()
    clearSamples()
    clearTestSequences()
    router.push("/information")
  }

  const handleOpen = (id: string) => {
    localStorage.setItem("currentReport", id)
    router.push("/information")
  }

  const filteredReports = reports.filter((report) => {
    if (filter === "completed") {
      return report.fields.status === "Completed"
    } else if (filter === "inProgress") {
      return report.fields.status !== "Completed"
    }
    return true
  })

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome + Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Report
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <Card className="flex items-center justify-between p-4">
              <div>
                <CardTitle className="text-sm text-muted-foreground">Total Reports</CardTitle>
                <div className="text-2xl font-bold">{reports.length}</div>
              </div>
              <Plus className="w-8 h-8 text-primary" />
            </Card>
            <Card className="flex items-center justify-between p-4">
              <div>
                <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
                <div className="text-2xl font-bold">
                  {reports.filter((r) => r.fields.status === "Completed").length}
                </div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </Card>
            <Card className="flex items-center justify-between p-4">
              <div>
                <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
                <div className="text-2xl font-bold">
                  {reports.filter((r) => r.fields.status !== "Completed").length}
                </div>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </Card>
          </>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button variant={filter === "all" ? "default" : "secondary"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "completed" ? "default" : "secondary"} onClick={() => setFilter("completed")}>
          Completed
        </Button>
        <Button variant={filter === "inProgress" ? "default" : "secondary"} onClick={() => setFilter("inProgress")}>
          In Progress
        </Button>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="space-y-2 mt-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border mt-4">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Report ID</th>
                <th className="text-left p-3">Project</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-muted/20">
                  <td className="p-3 font-mono">{report.id}</td>
                  <td className="p-3">{report.fields.project || "-"}</td>
                  <td className="p-3">{report.fields.product || "-"}</td>
                  <td className="p-3">{formatDate(report.created_at)}</td>
                  <td className="p-3 flex gap-2">
                    <Button variant="secondary" size="icon" onClick={() => handleOpen(report.id)}>
                      <PencilLine className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(report.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
