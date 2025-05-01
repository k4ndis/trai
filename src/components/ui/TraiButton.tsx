"use client"

import Button from "@mui/material/Button"
import type { ButtonProps } from "@mui/material/Button"

export default function TraiButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{ textTransform: "none", borderRadius: 2 }}
      {...props}
    />
  )
}
