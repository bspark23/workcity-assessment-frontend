"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { projectsAPI } from "@/lib/projects"
import { clientsAPI, type Client } from "@/lib/clients"
import { ArrowLeft, AlertCircle } from "lucide-react"

export default function AddProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "Pending" as "Pending" | "In Progress" | "Completed",
    clientId: "",
  })
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [error, setError] = useState("")
  const [clientsError, setClientsError] = useState("")

  const router = useRouter()

  const fetchClients = async () => {
    try {
      setIsLoadingClients(true)
      setClientsError("")
      const data = await clientsAPI.getAll()
      setClients(data)
    } catch (err: any) {
      setClientsError(err.response?.data?.message || "Failed to load clients")
    } finally {
      setIsLoadingClients(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await projectsAPI.create(formData)
      router.push("/projects")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Add New Project</h1>
              <p className="text-purple-300 mt-1">Create a new development project</p>
            </div>
          </div>

          {/* Form */}
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-purple-200">
                    Project Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-purple-200">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the project requirements and scope"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="deadline" className="text-sm font-medium text-purple-200">
                      Deadline *
                    </label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium text-purple-200">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-lg border border-purple-600/30 bg-purple-900/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                      required
                      disabled={isLoading}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="clientId" className="text-sm font-medium text-purple-200">
                    Client *
                  </label>
                  {isLoadingClients ? (
                    <div className="flex items-center gap-2 p-3">
                      <LoadingSpinner size="sm" />
                      <span className="text-purple-300">Loading clients...</span>
                    </div>
                  ) : clientsError ? (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-300 text-sm">{clientsError}</p>
                      <Button variant="ghost" size="sm" onClick={fetchClients} className="mt-2">
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <select
                      id="clientId"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-lg border border-purple-600/30 bg-purple-900/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} - {client.company}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading || isLoadingClients} className="flex-1">
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Project...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                  <Link href="/projects">
                    <Button variant="secondary" type="button" disabled={isLoading}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
