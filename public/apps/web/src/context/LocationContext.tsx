'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Location {
  city: string
  country: string
  flag: string
  lat?: number
  lng?: number
}

export const POPULAR_LOCATIONS: Location[] = [
  { city: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Abuja', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Port Harcourt', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Ibadan', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Kano', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Mombasa', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Accra', country: 'Ghana', flag: '🇬🇭' },
  { city: 'Kumasi', country: 'Ghana', flag: '🇬🇭' },
  { city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Cape Town', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Durban', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
  { city: 'Alexandria', country: 'Egypt', flag: '🇪🇬' },
  { city: 'Casablanca', country: 'Morocco', flag: '🇲🇦' },
  { city: 'Dakar', country: 'Senegal', flag: '🇸🇳' },
  { city: 'Dar es Salaam', country: 'Tanzania', flag: '🇹🇿' },
  { city: 'Kampala', country: 'Uganda', flag: '🇺🇬' },
  { city: 'Addis Ababa', country: 'Ethiopia', flag: '🇪🇹' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Manchester', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Paris', country: 'France', flag: '🇫🇷' },
  { city: 'Madrid', country: 'Spain', flag: '🇪🇸' },
  { city: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { city: 'New York', country: 'United States', flag: '🇺🇸' },
  { city: 'Los Angeles', country: 'United States', flag: '🇺🇸' },
  { city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
]

/** Convert a 2-letter ISO country code (e.g. "NG") to the matching flag emoji */
function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

/** Use the browser Geolocation API + OpenStreetMap Nominatim to resolve coordinates → city */
export async function detectUserLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { 'Accept-Language': 'en-US,en' } }
          )
          if (!res.ok) throw new Error('Geocoding request failed')
          const data = await res.json()

          const addr = data.address ?? {}
          const city =
            addr.city ?? addr.town ?? addr.village ?? addr.county ?? addr.state ?? 'Unknown'
          const country = addr.country ?? 'Unknown'
          const flag = addr.country_code
            ? countryCodeToFlag(addr.country_code)
            : '📍'

          resolve({ city, country, flag, lat: coords.latitude, lng: coords.longitude })
        } catch {
          reject(new Error('Could not determine your city. Please try again.'))
        }
      },
      (err) => {
        if (err.code === 1) reject(new Error('Location access denied. Please allow location in your browser settings.'))
        else if (err.code === 2) reject(new Error('Your location is currently unavailable.'))
        else reject(new Error('Location request timed out. Please try again.'))
      },
      { timeout: 10000, maximumAge: 300_000, enableHighAccuracy: false }
    )
  })
}

interface LocationContextType {
  location: Location
  setLocation: (loc: Location) => void
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const LocationContext = createContext<LocationContextType | null>(null)

const DEFAULT_LOCATION: Location = { city: 'Lagos', country: 'Nigeria', flag: '🇳🇬' }
const STORAGE_KEY = 'glovo_location'

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setLocationState(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  function setLocation(loc: Location) {
    setLocationState(loc)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
    } catch {
      // ignore
    }
  }

  return (
    <LocationContext.Provider value={{
      location,
      setLocation,
      isModalOpen,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used within LocationProvider')
  return ctx
}
