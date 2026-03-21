export interface User {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
  createdAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}
