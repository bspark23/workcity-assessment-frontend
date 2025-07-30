"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { dashboardAPI, type DashboardStats } from "@/lib/dashboard"
import { FolderOpen, Users, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await dashboardAPI.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const statCards = stats
    ? [
        {
          title: "Total Projects",
          value: stats.totalProjects.toString(),
          icon: FolderOpen,
          color: "from-blue-500 to-cyan-500",
        },
        {
          title: "Total Clients",
          value: stats.totalClients.toString(),
          icon: Users,
          color: "from-green-500 to-emerald-500",
        },
        {
          title: "In Progress",
          value: stats.projectsInProgress.toString(),
          icon: Clock,
          color: "from-yellow-500 to-orange-500",
        },
        {
          title: "Completed",
          value: stats.completedProjects.toString(),
          icon: CheckCircle,
          color: "from-purple-500 to-pink-500",
        },
      ]
    : []

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back! 👋</h1>
            <p className="text-purple-300 text-lg">Here's what's happening with your projects today.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchStats} />
          ) : stats ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                  <Card key={index} className="hover:scale-105 transition-transform duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-300 text-sm font-medium">{stat.title}</p>
                          <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentProjects.length > 0 ? (
                        stats.recentProjects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-purple-800/20"
                          >
                            <div>
                              <p className="text-white font-medium">{project.title}</p>
                              <p className="text-purple-300 text-sm">{project.client.company}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === "Completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : project.status === "In Progress"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-purple-300 text-center py-4">No recent projects</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentClients.length > 0 ? (
                        stats.recentClients.map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-purple-800/20"
                          >
                            <div>
                              <p className="text-white font-medium">{client.name}</p>
                              <p className="text-purple-300 text-sm">{client.company}</p>
                            </div>
                            <p className="text-purple-400 text-xs">{new Date(client.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-purple-300 text-center py-4">No recent clients</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
