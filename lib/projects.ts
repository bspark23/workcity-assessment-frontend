import api from "./axios";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  deadline: string;
  clientId: string;
  client?: {
    id: string;
    name: string;
    company: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  deadline: string;
  clientId: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Optional: alias if you still want to use ProjectFormData
export type ProjectFormData = CreateProjectData;

export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get("/api/projects");
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get('/api/projects/${id}');
    return response.data;
  },

  post: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post("/api/projects", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjectData): Promise<Project> => {
    const response = await api.put('/api/projects/${id}', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete('/api/projects/${id}');
  },

  getByClientId: async (clientId: string): Promise<Project[]> => {
    const response = await api.get('/projects/client/${clientId}');
    return response.data;
  },
};
