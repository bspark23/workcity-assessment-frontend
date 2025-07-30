import api from "./axios"

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  createdAt: string
  updatedAt: string
}

export interface CreateClientData {
  name: string
  email: string
  phone: string
  company: string
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export const clientsAPI = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get("/api/clients")
    return response.data
  },

  getById: async (id: string): Promise<Client> => {
    const response = await api.get(`/api/clients/${id}`)
    return response.data
  },

  create: async (data: CreateClientData): Promise<Client> => {
    const response = await api.post("/api/clients", data)
    return response.data
  },

  update: async (id: string, data: UpdateClientData): Promise<Client> => {
    const response = await api.put(`/api/clients/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/clients/${id}`)
  },
}
