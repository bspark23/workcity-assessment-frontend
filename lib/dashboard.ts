import api from "./axios"

export interface DashboardStats {
  totalProjects: number
  totalClients: number
  projectsInProgress: number
  completedProjects: number
  recentProjects: Array<{
    id: string
    title: string
    status: string
    client: {
      name: string
      company: string
    }
  }>
  recentClients: Array<{
    id: string
    name: string
    company: string
    createdAt: string
  }>
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats")
    return response.data
  },
}
