'use client'

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Spinner } from '@/components/ui/Spinner'

const CUISINE_OPTIONS  = ['Yoruba', 'Hausa', 'Lagos', 'Igbo', 'Edo', 'Efik', 'Pan-Nigerian', 'Other']
const CATEGORY_OPTIONS = ['Soups', 'Swallow', 'Rice Dishes', 'Suya & Grills', 'Pepper Soup', 'Snacks', 'Drinks', 'Desserts', 'Proteins', 'Sides']

export default function RestaurantRegisterPage() {
  const { isAuthenticated, isLoading, token } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [ownerName,    setOwnerName]    = useState('')
  const [ownerPhone,   setOwnerPhone]   = useState('')
  const [name,         setName]         = useState('')
  const [description,  setDescription]  = useState('')
  const [cuisine,      setCuisine]      = useState('')
  const [address,      setAddress]      = useState('')
  const [categories,   setCategories]   = useState<string[]>([])
  const [imageUrl,     setImageUrl]     = useState('')   // final URL sent to server
  const [preview,      setPreview]      = useState('')   // local blob preview
  const [uploading,    setUploading]    = useState(false)
  const [uploadError,  setUploadError]  = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState('')
  const [submitted,    setSubmitted]    = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login')
  }, [isLoading, isAuthenticated, router])

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setUploadError('Only JPEG, PNG and WebP images are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.')
      return
    }

    setUploadError('')
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImageUrl(data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.')
      setPreview('')
    } finally {
      setUploading(false)
    }
  }

  function removeImage() {
    setPreview('')
    setImageUrl('')
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!ownerName || !ownerPhone || !name || !description || !cuisine || !address) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/restaurants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ownerName, ownerPhone, name, description, cuisine, address, categories, imageUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading || !isAuthenticated) return null

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="relative z-10 mx-auto max-w-lg px-4 py-16 text-center">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-black text-[var(--text)] mb-2">Application submitted!</h1>
            <p className="text-sm text-[var(--text-3)] leading-relaxed mb-6">
              Your restaurant application is now under review by the D&amp;D team. We will contact you once a decision has been made.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/restaurants" className="w-full py-3 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--gold-text)] font-bold text-sm transition-colors text-center">
                Browse Restaurants
              </Link>
              <Link href="/" className="w-full py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] font-semibold text-sm transition-colors text-center hover:border-[var(--gold)]/50">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="flex items-center justify-center w-9 h-9 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/50 transition-colors">
            <svg className="w-4 h-4 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[var(--text)]">Register Your Restaurant</h1>
            <p className="text-sm text-[var(--text-3)]">Submit for review — the D&amp;D team will approve within 24 hrs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Owner info */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-[var(--text)] mb-4">Your details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">Full name *</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">Phone number *</label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Restaurant info */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-[var(--text)] mb-4">Restaurant details</h2>
            <div className="flex flex-col gap-3">

              <div>
                <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">Restaurant name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mama Cee's Buka"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Tell customers what makes your restaurant special..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">Cuisine type *</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  >
                    <option value="">Select cuisine...</option>
                    {CUISINE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">Address *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 12 Bode Thomas St, Lagos"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* ── Image upload ── */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-widest block mb-1.5">
                  Restaurant photo <span className="normal-case font-normal">(optional · max 5 MB)</span>
                </label>

                {preview ? (
                  /* Preview card */
                  <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
                    <Image
                      src={preview}
                      alt="Restaurant preview"
                      width={800}
                      height={300}
                      className="w-full h-48 object-cover"
                      unoptimized
                    />
                    {/* Uploading overlay */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                        <Spinner className="w-8 h-8 text-[var(--gold)]" />
                        <p className="text-white text-sm font-semibold">Uploading…</p>
                      </div>
                    )}
                    {/* Uploaded badge */}
                    {!uploading && imageUrl && (
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-green-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Uploaded
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {/* Change button */}
                    {!uploading && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Change photo
                      </button>
                    )}
                  </div>
                ) : (
                  /* Drop zone */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold-bg)] transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--gold)]/40 flex items-center justify-center transition-colors">
                      <svg className="w-6 h-6 text-[var(--text-3)] group-hover:text-[var(--gold)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[var(--text-2)] group-hover:text-[var(--gold)] transition-colors">
                        Tap to upload a photo
                      </p>
                      <p className="text-xs text-[var(--text-3)] mt-0.5">JPEG, PNG or WebP · max 5 MB</p>
                    </div>
                  </button>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {uploadError && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-[var(--text)] mb-1">Menu categories</h2>
            <p className="text-xs text-[var(--text-3)] mb-3">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                    categories.includes(cat)
                      ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--gold-text)]'
                      : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-[var(--gold-bg)] border border-[var(--gold-border)]">
            <span className="text-xl shrink-0">📋</span>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              Your application will be reviewed by the D&amp;D team. Only approved restaurants appear on the platform. You will be contacted via your registered email once a decision is made.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-4 bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-60 rounded-2xl text-base font-black text-[var(--gold-text)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ boxShadow: 'var(--shadow-gold)' }}
          >
            {submitting
              ? <><Spinner className="w-5 h-5 text-[var(--gold-text)]" /> Submitting...</>
              : uploading
              ? <><Spinner className="w-5 h-5 text-[var(--gold-text)]" /> Uploading image...</>
              : 'Submit Application'}
          </button>
        </form>
      </main>
    </>
  )
}
