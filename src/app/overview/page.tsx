// app/overview/page.tsx
"use client"

import {
  Box,
  Card,
  CardContent,
  Dialog,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useInformationStore } from "@/lib/store"
import ReportModal from "@/components/ReportModal"
import { Container } from "@/components/container"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export default function OverviewPage() {
  const router = useRouter()
  const fields = useInformationStore((state) => state.fields)
  const [modalOpen, setModalOpen] = useState(false)

  const isStepCompleted = (key: string): boolean => {
    switch (key) {
      case "report":
        return !!fields.report
      case "samples":
        return false // TODO: später ersetzen
      case "procedure":
        return !!fields.testtype
      case "evaluation":
        return false // TODO: später ersetzen
      case "results":
        return !!fields.result
      case "review":
        return false // TODO: später ersetzen
      default:
        return false
    }
  }

  return (
    <Container className="space-y-6">
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Report Info Card */}
        <Box onClick={() => setModalOpen(true)} className="relative cursor-pointer">
          <Card sx={{ bgcolor: "grey.900", color: "white", position: "relative" }}>
            <CardContent>
              <Typography variant="h6">Report Info</Typography>
              <Typography variant="body2" mt={1}>
                {fields.report || "Click to enter report data"}
              </Typography>
              {isStepCompleted("report") && (
                <CheckCircleIcon sx={{ position: "absolute", top: 8, right: 8, color: "green" }} />
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Other Sections */}
        {[
          { key: "samples", title: "Samples", preview: "Sample previews", link: "/testsamples" },
          { key: "procedure", title: "Procedure", preview: "Defined test steps", link: "/testprocedure" },
          { key: "evaluation", title: "Evaluation", preview: "Evaluation not started", link: "/evaluation" },
          { key: "results", title: "Results", preview: fields.result || "No results yet", link: "/results" },
          { key: "review", title: "Review", preview: "Pending review", link: "/review" },
        ].map((section) => (
          <Box key={section.title} onClick={() => router.push(section.link)} className="relative cursor-pointer">
            <Card sx={{ position: "relative" }}>
              <CardContent>
                <Typography variant="h6">{section.title}</Typography>
                <Typography variant="body2" mt={1}>{section.preview}</Typography>
                {isStepCompleted(section.key) && (
                  <CheckCircleIcon sx={{ position: "absolute", top: 8, right: 8, color: "green" }} />
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <ReportModal onClose={() => setModalOpen(false)} />
      </Dialog>
    </Container>
  )
}

