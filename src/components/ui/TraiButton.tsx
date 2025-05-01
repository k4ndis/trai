"use client"

import Button from "@mui/material/Button"
import type { ButtonProps } from "@mui/material/Button"

export default function TraiButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{
        textTransform: "none",
        borderRadius: 2,
        ...sx, // ⬅ überschreibt gezielt nur, was du beim Aufruf veränderst
      }}
      {...props}
    />
  )
}
