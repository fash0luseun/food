'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocation, detectUserLocation } from '@/context/LocationContext'

export function LocationHero() {
  const { location, setLocation, openModal } = useLocation()
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState('')
  const [justDetected, setJustDetected] = useState(false)

  async function handleDetect() {
    setDetecting(true)
    setError('')
    setJustDetected(false)
    try {
      const detected = await detectUserLocation()
      setLocation(detected)
      setJustDetected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not detect location.')
    } finally {
      setDetecting(false)
    }
  }

  const mapsUrl = location.lat && location.lng
    ? `https://maps.google.com/maps?q=${location.lat},${location.lng}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(`${location.city}, ${location.country}`)}`

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto lg:mx-0">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Location picker */}
        <button
          onClick={openModal}
          className="relative flex-1 flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#13131C] border border-[#252535] hover:border-[#D4AF37]/60 text-left transition-all group"
        >
          <span className="text-xl">{location.flag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#50507A] font-medium">Delivering to</p>
            <p className="text-sm font-bold text-white truncate">{location.city}, {location.country}</p>
          </div>
          <svg className="w-4 h-4 text-[#50507A] group-hover:text-[#D4AF37] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Find food CTA */}
        <Link
          href="/restaurants"
          className="px-8 py-4 bg-[#D4AF37] hover:bg-[#E8C84A] text-[#09090E] rounded-2xl font-black text-sm transition-colors shrink-0 text-center active:scale-[0.98]"
        >
          Find food
        </Link>
      </div>

      {/* Bottom row: detect button + maps link */}
      <div className="flex items-center justify-between px-1">
        {/* Detect location */}
        <button
          onClick={handleDetect}
          disabled={detecting}
          className="flex items-center gap-1.5 text-xs text-[#6060A0] hover:text-[#D4AF37] transition-colors disabled:cursor-wait"
        >
          {detecting ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[#D4AF37]">Detecting…</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Use my current location</span>
            </>
          )}
        </button>

        {/* Google Maps verify link */}
        {justDetected && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Verify on Google Maps →
          </a>
        )}
      </div>

      {error && <p className="text-xs text-red-400 px-1">{error}</p>}
    </div>
  )
}
