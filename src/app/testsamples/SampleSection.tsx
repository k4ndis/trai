// src/app/testprocedure/SampleSection.tsx
"use client"

import { Container } from "@/components/container"
import { SampleTable } from "@/components/SampleTable"

export interface SampleImage {
  url: string
  label: string
}

export interface Sample {
  id: number
  productNumber: string
  productionDate: string
  serialNumber: string
  features: string
  images: SampleImage[]
}

export function SampleSection() {
  return (
    <Container id="testsamples">      
      <SampleTable />
    </Container>
  )
}
