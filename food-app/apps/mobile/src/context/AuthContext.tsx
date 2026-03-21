import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { User } from '@food-app/shared'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, isLoading: false }
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)
const TOKEN_KEY = 'food_app_token'
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isLoading: true,
  })

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }
      fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token } })
          } else {
            AsyncStorage.removeItem(TOKEN_KEY)
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        })
        .catch(() => {
          AsyncStorage.removeItem(TOKEN_KEY)
          dispatch({ type: 'SET_LOADING', payload: false })
        })
    })
  }, [])

  async function login(token: string, user: User) {
    await AsyncStorage.setItem(TOKEN_KEY, token)
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
  }

  async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY)
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAuthenticated: !!state.user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
