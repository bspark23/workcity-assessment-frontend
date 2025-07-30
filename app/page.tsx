"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, Zap, Shield } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Workcity
            </span>
          </h1>
          <p className="text-xl text-purple-300 mb-8 max-w-2xl mx-auto">
            The ultimate developer dashboard for managing projects, clients, and your development workflow. Built for
            modern teams who value efficiency and beautiful design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Code,
              title: "Project Management",
              description: "Organize and track your development projects with ease",
            },
            {
              icon: Users,
              title: "Client Portal",
              description: "Manage client relationships and communications",
            },
            {
              icon: Zap,
              title: "Real-time Updates",
              description: "Live data synchronization across all your devices",
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Enterprise-grade security for your sensitive data",
            },
          ].map((feature, index) => (
            <Card key={index} className="hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-300 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-4">Ready to Transform Your Workflow?</CardTitle>
            <p className="text-purple-300 text-lg">
              Join thousands of developers who trust Workcity to manage their projects and clients.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Start Your Free Trial
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
