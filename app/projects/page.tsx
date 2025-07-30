"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { projectsAPI, type Project } from "@/lib/projects"
import { Edit, Trash2, Plus, Search } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await projectsAPI.getAll()
      setProjects(data)
      setFilteredProjects(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      setDeletingId(id)
      await projectsAPI.delete(id)
      const updatedProjects = projects.filter((p) => p.id !== id)
      setProjects(updatedProjects)
      setFilteredProjects(
        updatedProjects.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.client?.company.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete project")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const filtered = projects.filter((project) => {
  const titleMatch = project.title?.toLowerCase().includes(searchTerm.toLowerCase());
  const clientMatch = project.client?.company?.toLowerCase().includes(searchTerm.toLowerCase());
  return titleMatch || clientMatch;
});
    setFilteredProjects(filtered)
  }, [searchTerm, projects])

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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="text-purple-300 mt-1">Manage all your development projects</p>
            </div>
            <Link href="/projects/add">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchProjects} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-600/20">
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Title</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Description</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Deadline</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Client</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b border-purple-600/10 hover:bg-purple-800/10">
                          <td className="py-4 px-4">
                            <p className="text-white font-medium">{project.title}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-purple-300 text-sm max-w-xs truncate">{project.description}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-purple-300">{new Date(project.deadline).toLocaleDateString()}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-white">{project.client?.company || "N/A"}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/projects/edit/${project.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                                disabled={deletingId === project.id}
                              >
                                {deletingId === project.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProjects.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                      <p className="text-purple-300">No projects found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
