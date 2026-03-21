'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Spinner } from '@/components/ui/Spinner'
import type { RestaurantSubmission } from '@/data/restaurant-submissions'

const STATUS_STYLE: Record<string, string> = {
  pending:  'text-[var(--gold)] bg-[var(--gold-bg)] border-[var(--gold-border)]',
  approved: 'text-green-600 bg-green-500/10 border-green-500/30',
  rejected: 'text-red-500 bg-red-500/10 border-red-500/30',
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<RestaurantSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actionId, setActionId] = useState<string | null>(null)
  const [noteMap, setNoteMap] = useState<Record<string, string>>({})

  // Guard: must be logged-in admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login')
    if (!isLoading && isAuthenticated && user?.role !== 'admin') router.replace('/')
  }, [isLoading, isAuthenticated, user, router])

  const fetchSubmissions = useCallback(async () => {
    const res = await fetch('/api/admin/submissions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.submissions) setSubmissions(data.submissions)
  }, [token])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === 'admin') {
      fetchSubmissions().finally(() => setLoading(false))
    }
  }, [isLoading, isAuthenticated, user, fetchSubmissions])

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionId(id)
    await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, adminNote: noteMap[id] ?? '' }),
    })
    await fetchSubmissions()
    setActionId(null)
  }

  if (isLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner className="w-8 h-8 text-[var(--gold)]" />
        </div>
      </>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') return null

  const filtered = submissions.filter((s) => filter === 'all' || s.status === filter)
  const counts = {
    pending:  submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  }

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[var(--gold)] bg-[var(--gold-bg)] border border-[var(--gold-border)] px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
            </div>
            <h1 className="text-2xl font-black text-[var(--text)]">Restaurant Applications</h1>
            <p className="text-sm text-[var(--text-3)] mt-0.5">Review and approve restaurant registration requests</p>
          </div>
          <Link href="/" className="text-sm text-[var(--gold)] hover:underline font-semibold">← Back to site</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Pending',  key: 'pending',  value: counts.pending,  color: 'text-[var(--gold)]' },
            { label: 'Approved', key: 'approved', value: counts.approved, color: 'text-green-600' },
            { label: 'Rejected', key: 'rejected', value: counts.rejected, color: 'text-red-500' },
          ].map((stat) => (
            <div key={stat.key} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[var(--text-3)] font-semibold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all capitalize ${
                filter === tab
                  ? 'bg-[var(--gold)] text-[var(--gold-text)] border-[var(--gold)]'
                  : 'bg-[var(--surface)] text-[var(--text-2)] border-[var(--border)] hover:border-[var(--gold)]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Submissions list */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-semibold text-[var(--text)]">No {filter === 'all' ? '' : filter} applications</p>
            <p className="text-sm text-[var(--text-3)] mt-1">
              {filter === 'pending' ? 'No restaurants are waiting for review.' : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((sub) => (
              <div key={sub.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-[var(--text)] text-lg">{sub.name}</h2>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLE[sub.status]}`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-3)] mt-0.5">{sub.cuisine} · {sub.address}</p>
                  </div>
                  <p className="text-xs text-[var(--text-3)] shrink-0">{new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-2)] mb-3 leading-relaxed">{sub.description}</p>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="bg-[var(--surface-2)] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-1">Owner</p>
                    <p className="font-semibold text-[var(--text)]">{sub.ownerName}</p>
                  </div>
                  <div className="bg-[var(--surface-2)] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-1">Email</p>
                    <p className="font-semibold text-[var(--text)] truncate">{sub.ownerEmail}</p>
                  </div>
                  <div className="bg-[var(--surface-2)] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-1">Phone</p>
                    <p className="font-semibold text-[var(--text)]">{sub.ownerPhone}</p>
                  </div>
                </div>

                {/* Categories */}
                {sub.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sub.categories.map((cat) => (
                      <span key={cat} className="text-xs font-semibold text-[var(--text-2)] bg-[var(--surface-2)] border border-[var(--border)] px-2.5 py-1 rounded-lg">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Admin note (if already reviewed) */}
                {sub.status !== 'pending' && sub.adminNote && (
                  <p className="text-xs text-[var(--text-3)] italic mb-3">Admin note: "{sub.adminNote}"</p>
                )}

                {/* Action area (only for pending) */}
                {sub.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-[var(--border)]">
                    <input
                      type="text"
                      placeholder="Optional note to owner..."
                      value={noteMap[sub.id] ?? ''}
                      onChange={(e) => setNoteMap((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(sub.id, 'approve')}
                        disabled={actionId === sub.id}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {actionId === sub.id ? <Spinner className="w-4 h-4" /> : '✓'} Approve
                      </button>
                      <button
                        onClick={() => handleAction(sub.id, 'reject')}
                        disabled={actionId === sub.id}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {actionId === sub.id ? <Spinner className="w-4 h-4" /> : '✕'} Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
