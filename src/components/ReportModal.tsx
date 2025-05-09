// components/ReportModal.tsx
"use client"

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  TextField,  
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material"
import { useState } from "react"
import { useInformationStore } from "@/lib/store"

const steps = ["General", "Documents", "Test Info", "Distribution"]

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(0)
  const fields = useInformationStore((s) => s.fields)
  const updateField = useInformationStore((s) => s.updateField)

  const distributionOptions = ["Bonnet", "Brenner", "Neuber", "Schabinger"]
  const currentDistribution = fields.distributionlist?.split(", ") || []

  const handleDistChange = (name: string) => {
    const updated = currentDistribution.includes(name)
      ? currentDistribution.filter((p) => p !== name)
      : [...currentDistribution, name]
    updateField("distributionlist", updated.join(", "))
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Report" value={fields.report || ""} onChange={(e) => updateField("report", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Project" value={fields.project || ""} onChange={(e) => updateField("project", e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Product" value={fields.product || ""} onChange={(e) => updateField("product", e.target.value)} />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Product Number" value={fields.productnumber || ""} onChange={(e) => updateField("productnumber", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Drawing" value={fields.drawing || ""} onChange={(e) => updateField("drawing", e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="DVP" value={fields.dvp || ""} onChange={(e) => updateField("dvp", e.target.value)} />
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Test" value={fields.test || ""} onChange={(e) => updateField("test", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Result" value={fields.result || ""} onChange={(e) => updateField("result", e.target.value)} />
            </Grid>
          </Grid>
        )
      case 3:
        return (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {distributionOptions.map((name) => (
              <FormControlLabel
                key={name}
                label={name}
                control={
                  <Checkbox
                    checked={currentDistribution.includes(name)}
                    onChange={() => handleDistChange(name)}
                  />
                }
              />
            ))}
            <TextField
              fullWidth
              multiline
              label="Distribution Preview"
              value={currentDistribution.join(", ")}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
          </Box>
        )
    }
  }

  return (
    <>
      <DialogTitle>Setup Report Info</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
        {renderStep()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        {activeStep > 0 && <Button onClick={() => setActiveStep((s) => s - 1)}>Back</Button>}
        {activeStep < steps.length - 1 ? (
          <Button onClick={() => setActiveStep((s) => s + 1)} variant="contained">Next</Button>
        ) : (
          <Button onClick={onClose} variant="contained">Finish</Button>
        )}
      </DialogActions>
    </>
  )
}