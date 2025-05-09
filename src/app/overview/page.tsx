// app/overview/page.tsx
"use client"

import {
  Box,
  Card,
  CardContent,
  Dialog,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useInformationStore } from "@/lib/store"
import ReportModal from "@/components/ReportModal"

export default function OverviewPage() {
  const router = useRouter()
  const fields = useInformationStore((state) => state.fields)
  const [modalOpen, setModalOpen] = useState(false)

  const requiredFields = [
    "report",
    "project",
    "product",
    "productnumber",
    "drawing",
    "dvp",
    "test",
    "result",
  ]

  const completed = requiredFields.filter((key) => fields[key])

  const sections = [
    { title: "Samples", preview: "Sample previews", link: "/testsamples" },
    { title: "Procedure", preview: "Defined test steps", link: "/testprocedure" },
    { title: "Evaluation", preview: "Evaluation not started", link: "/evaluation" },
    { title: "Results", preview: fields.result || "No results yet", link: "/results" },
    { title: "Review", preview: "Pending review", link: "/review" },
  ]

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Test Report Overview
      </Typography>

      <Stepper activeStep={completed.length} alternativeLabel sx={{ my: 4 }}>
        {requiredFields.map((field) => (
          <Step key={field} completed={Boolean(fields[field])}>
            <StepLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Box onClick={() => setModalOpen(true)} className="cursor-pointer">
          <Card sx={{ bgcolor: "grey.900", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Report Info</Typography>
              <Typography variant="body2" mt={1}>
                {fields.report || "Click to enter report data"}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {sections.map((section) => (
          <Box key={section.title} onClick={() => router.push(section.link)} className="cursor-pointer">
            <Card>
              <CardContent>
                <Typography variant="h6">{section.title}</Typography>
                <Typography variant="body2" mt={1}>{section.preview}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <ReportModal onClose={() => setModalOpen(false)} />
      </Dialog>
    </Box>
  )
}
