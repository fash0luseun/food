import { apiRequest } from './client'
import type { AuthPayload, LoginRequest, SignupRequest, User } from '../types/user'

export function login(data: LoginRequest): Promise<AuthPayload> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function signup(data: SignupRequest): Promise<AuthPayload> {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getMe(): Promise<{ user: User }> {
  return apiRequest('/api/auth/me')
}
