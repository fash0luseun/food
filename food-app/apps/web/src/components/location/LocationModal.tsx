'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocation, POPULAR_LOCATIONS, detectUserLocation, type Location } from '@/context/LocationContext'

type DetectState = 'idle' | 'loading' | 'error'

export function LocationModal() {
  const { location, setLocation, isModalOpen, closeModal } = useLocation()
  const [search, setSearch] = useState('')
  const [detectState, setDetectState] = useState<DetectState>('idle')
  const [detectError, setDetectError] = useState('')
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isModalOpen) {
      setSearch('')
      setDetectState('idle')
      setDetectError('')
      setDetectedCoords(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isModalOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    if (isModalOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isModalOpen, closeModal])

  async function handleDetectLocation() {
    setDetectState('loading')
    setDetectError('')
    setDetectedCoords(null)
    try {
      const detected = await detectUserLocation()
      setLocation(detected)
      if (detected.lat && detected.lng) {
        setDetectedCoords({ lat: detected.lat, lng: detected.lng })
      }
      // Don't auto-close — show the Google Maps verify link first
      setDetectState('idle')
    } catch (err) {
      setDetectState('error')
      setDetectError(err instanceof Error ? err.message : 'Could not detect location.')
    }
  }

  if (!isModalOpen) return null

  const filtered = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.country.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, Location[]>>((acc, loc) => {
    if (!acc[loc.country]) acc[loc.country] = []
    acc[loc.country].push(loc)
    return acc
  }, {})

  function handleSelect(loc: Location) {
    setLocation(loc)
    closeModal()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={closeModal} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="w-full sm:max-w-md bg-[#13131C] border border-[#252535] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#1E1E2A]">
            <div>
              <h2 className="text-lg font-black text-white">Choose your location</h2>
              <p className="text-xs text-[#6060A0] mt-0.5">Select or detect your delivery city</p>
            </div>
            <button
              onClick={closeModal}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1C1C28] border border-[#252535] hover:border-[#D4AF37]/50 transition-colors"
            >
              <svg className="w-4 h-4 text-[#A0A0C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Use my location button ── */}
          <div className="px-5 py-3 border-b border-[#1E1E2A]">
            <button
              onClick={handleDetectLocation}
              disabled={detectState === 'loading'}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all font-semibold text-sm ${
                detectState === 'loading'
                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] cursor-wait'
                  : detectState === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/15'
                  : 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 active:scale-[0.98]'
              }`}
            >
              {detectState === 'loading' ? (
                <>
                  {/* Spinner */}
                  <svg className="w-5 h-5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Detecting your location…</span>
                </>
              ) : detectState === 'error' ? (
                <>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex-1 text-left">Tap to retry</span>
                </>
              ) : (
                <>
                  {/* GPS icon */}
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Use my current location</span>
                  <svg className="w-4 h-4 shrink-0 ml-auto opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Error detail message */}
            {detectState === 'error' && detectError && (
              <p className="mt-2 text-xs text-red-400 px-1">{detectError}</p>
            )}

            {/* Google Maps verify link + confirm — shown after successful detection */}
            {detectedCoords && (
              <div className="mt-3 p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#A0A0C0]">
                    📍 Detected: <span className="text-white font-semibold">{location.city}, {location.country}</span>
                  </p>
                  <a
                    href={`https://maps.google.com/maps?q=${detectedCoords.lat},${detectedCoords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline shrink-0 ml-2"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E8C84A] text-[#09090E] text-sm font-black transition-colors"
                >
                  Confirm location
                </button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-[#1E1E2A]">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#50507A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Or search city or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1C1C28] border border-[#252535] text-white placeholder-[#50507A] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#50507A] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Current location */}
          <div className="px-5 py-3 border-b border-[#1E1E2A] bg-[#D4AF37]/5">
            <p className="text-xs font-bold text-[#50507A] uppercase tracking-widest mb-2">Current location</p>
            <div className="flex items-center gap-3 py-1">
              <span className="text-2xl">{location.flag}</span>
              <div>
                <p className="font-bold text-white text-sm">{location.city}</p>
                <p className="text-xs text-[#6060A0]">{location.country}</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-1 rounded-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Active
              </span>
            </div>
          </div>

          {/* City list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-3xl mb-2">📍</p>
                <p className="font-medium text-sm text-white">No cities found</p>
                <p className="text-xs mt-1 text-[#6060A0]">Try a different search</p>
              </div>
            ) : (
              Object.entries(grouped).map(([country, cities]) => (
                <div key={country}>
                  <div className="px-5 py-2 bg-[#0F0F16] border-y border-[#1E1E2A]">
                    <p className="text-xs font-bold text-[#50507A] uppercase tracking-widest flex items-center gap-2">
                      <span>{cities[0].flag}</span>{country}
                    </p>
                  </div>
                  {cities.map((loc) => {
                    const isActive = loc.city === location.city && loc.country === location.country
                    return (
                      <button
                        key={`${loc.city}-${loc.country}`}
                        onClick={() => handleSelect(loc)}
                        className={`w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#D4AF37]/5 transition-colors text-left border-b border-[#1A1A26] ${
                          isActive ? 'bg-[#D4AF37]/8' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#1C1C28] border border-[#252535] flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-[#50507A]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${isActive ? 'text-[#D4AF37]' : 'text-white'}`}>{loc.city}</p>
                          <p className="text-xs text-[#6060A0]">{loc.country}</p>
                        </div>
                        {isActive && (
                          <svg className="w-5 h-5 text-[#D4AF37] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
