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
import { clientsAPI, type Client } from "@/lib/clients"
import { Edit, Trash2, Plus, Search, Eye } from "lucide-react"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await clientsAPI.getAll()
      setClients(data)
      setFilteredClients(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load clients")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      setDeletingId(id)
      await clientsAPI.delete(id)
      const updatedClients = clients.filter((c) => c.id !== id)
      setClients(updatedClients)
      setFilteredClients(
        updatedClients.filter(
          (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete client")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClients(filtered)
  }, [searchTerm, clients])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Clients</h1>
              <p className="text-purple-300 mt-1">Manage your client relationships</p>
            </div>
            <Link href="/clients/add">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Clients ({filteredClients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchClients} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-600/20">
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Phone</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Company</th>
                        <th className="text-left py-3 px-4 text-purple-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="border-b border-purple-600/10 hover:bg-purple-800/10">
                          <td className="py-4 px-4">
                            <p className="text-white font-medium">{client.name}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-purple-300">{client.email}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-purple-300">{client.phone}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-white">{client.company}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/clients/${client.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/clients/edit/${client.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(client.id)}
                                disabled={deletingId === client.id}
                              >
                                {deletingId === client.id ? (
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
                  {filteredClients.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                      <p className="text-purple-300">No clients found</p>
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
