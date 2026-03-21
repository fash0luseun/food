'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { CartProvider } from './CartContext'
import { LocationProvider } from './LocationContext'
import { ThemeProvider } from './ThemeContext'
import { LocationModal } from '@/components/location/LocationModal'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            {children}
            <LocationModal />
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
