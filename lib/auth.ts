import api from "./axios"

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  role: "admin" | "user"
}

export interface AuthResponse {
  user: User
  token: string
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
},
register: async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
},

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token")
  },
}
