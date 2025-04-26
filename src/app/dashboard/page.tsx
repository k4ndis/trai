"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, PencilLine } from "lucide-react"

interface Report {
  id: string
  fields: {
    project?: string
    product?: string
    status?: string // Später evtl. ergänzen
  }
  created_at: string
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

      if (error) console.error(error)
      else setReports(data as Report[])

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
      alert("Error deleting report: " + error.message)
    } else {
      setReports((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const handleOpen = (id: string) => {
    // Hier später noch Navigation und Laden der Daten verbessern
    router.push("/information") // Gehe zu Information-Page
    localStorage.setItem("currentReport", id) // (nur Übergangslösung, später schöner!)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <Button onClick={() => router.push("/information")}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Report
        </Button>
      </div>

      {loading ? (
        <div>Loading reports...</div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
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
              {reports.map((report) => (
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
