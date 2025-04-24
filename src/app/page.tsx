// src/app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to TRAI</h1>
        <p className="text-muted-foreground text-lg">
          The Test Report AI Assistant. Create, manage and analyze test reports — structured, fast and smart.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Button asChild size="lg">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-xl">Smart Test Reports</h3>
            <p className="text-sm text-muted-foreground">
              Generate structured and professional reports with intelligent form filling.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-xl">Photo & Data Upload</h3>
            <p className="text-sm text-muted-foreground">
              Add images, measurements and specifications directly into your reports.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-xl">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Let TRAI support you with smart suggestions, auto-analysis and structured export.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Start your next report with TRAI</h2>
        <Button asChild size="lg">
          <Link href="/signup">
            Start Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </section>
    </main>
  )
}
