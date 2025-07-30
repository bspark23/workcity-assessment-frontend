"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { clientsAPI, type Client } from "@/lib/clients"
import { projectsAPI, type Project } from "@/lib/projects"
import { ArrowLeft, Mail, Phone, Building, Edit, FolderOpen } from "lucide-react"

export default function ClientProfilePage() {
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [error, setError] = useState("")
  const [projectsError, setProjectsError] = useState("")

  const fetchClient = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await clientsAPI.getById(clientId)
      setClient(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load client")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true)
      setProjectsError("")
      const data = await projectsAPI.getByClientId(clientId)
      setProjects(data)
    } catch (err: any) {
      setProjectsError(err.response?.data?.message || "Failed to load projects")
    } finally {
      setIsLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (clientId) {
      fetchClient()
      fetchProjects()
    }
  }, [clientId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Pending":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error || !client) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <ErrorMessage message={error || "Client not found"} onRetry={fetchClient} />
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/clients">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{client.name}</h1>
              <p className="text-purple-300 mt-1">Client since {new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
            <Link href={`/clients/edit/${client.id}`}>
              <Button className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Client
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Details */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-300">Email</p>
                      <p className="text-white">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-300">Phone</p>
                      <p className="text-white">{client.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-300">Company</p>
                      <p className="text-white">{client.company || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projects ({projects.length})</CardTitle>
                  <Link href={`/projects/add?clientId=${client.id}`}>
                    <Button size="sm" className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      New Project
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {isLoadingProjects ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : projectsError ? (
                    <ErrorMessage message={projectsError} onRetry={fetchProjects} />
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="p-4 rounded-lg bg-purple-800/20 border border-purple-600/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-medium">{project.title}</h3>
                              <p className="text-purple-300 text-sm mt-1">
                                Deadline: {new Date(project.deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {projects.length === 0 && (
                        <div className="text-center py-8">
                          <FolderOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                          <p className="text-purple-300">No projects yet</p>
                          <p className="text-purple-400 text-sm">Create a new project to get started</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
