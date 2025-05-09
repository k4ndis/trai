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
import { Container } from "@/components/container"

export default function OverviewPage() {
  const router = useRouter()
  const fields = useInformationStore((state) => state.fields)
  const [modalOpen, setModalOpen] = useState(false)

  const steps = [
    { key: "report", label: "Report Info" },
    { key: "samples", label: "Samples" },
    { key: "procedure", label: "Procedure" },
    { key: "evaluation", label: "Evaluation" },
    { key: "results", label: "Results" },
    { key: "review", label: "Review" },
  ]

  // Simpler Completion Checker (nur einige Felder aktiv aktuell)
  const isStepCompleted = (key: string): boolean => {
    switch (key) {
      case "report":
        return !!fields.report
      case "samples":
        return false // TODO: später mit Zustand oder fields.samples.length > 0 ersetzen
      case "procedure":
        return !!fields.testtype
      case "evaluation":
        return false // TODO: später mit evaluation-Feld ersetzen
      case "results":
        return !!fields.result // falls du später result speicherst
      case "review":
        return false // TODO: später mit review-Feld ersetzen
      default:
        return false
    }
  }

  const activeStepIndex = steps.findIndex((step) => !isStepCompleted(step.key))

  const sections = [
    { title: "Samples", preview: "Sample previews", link: "/testsamples" },
    { title: "Procedure", preview: "Defined test steps", link: "/testprocedure" },
    { title: "Evaluation", preview: "Evaluation not started", link: "/evaluation" },
    { title: "Results", preview: fields.result || "No results yet", link: "/results" },
    { title: "Review", preview: "Pending review", link: "/review" },
  ]

  return (
    <Container className="space-y-6">
      <Stepper activeStep={activeStepIndex} alternativeLabel sx={{ my: 2 }}>
        {steps.map((step) => (
          <Step key={step.key} completed={isStepCompleted(step.key)}>
            <StepLabel>{step.label}</StepLabel>
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
    </Container>
  )
}

