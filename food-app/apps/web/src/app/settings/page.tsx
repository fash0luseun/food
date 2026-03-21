'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme, type Theme } from '@/context/ThemeContext'
import { useLocation } from '@/context/LocationContext'
import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/ui/Logo'

type SectionTab = 'profile' | 'address' | 'payment' | 'notifications' | 'security'

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'profile',       label: 'Profile',          icon: '👤' },
  { key: 'address',       label: 'Address',          icon: '📍' },
  { key: 'payment',       label: 'Payment Methods',  icon: '💳' },
  { key: 'notifications', label: 'Notifications',    icon: '🔔' },
  { key: 'security',      label: 'Security',         icon: '🔒' },
]

interface Address {
  id: string
  label: string
  icon: string
  detail: string
}

interface PaymentCard {
  id: string
  label: string
  icon: string
  detail: string
  type: 'card' | 'wallet'
  status: 'Connected' | 'Complete' | 'Disconnected'
}

const DEFAULT_ADDRESSES: Address[] = [
  { id: 'home',   label: 'Home',          icon: '🏠', detail: '1901 Thornridge Cir. Shiloh, Hawaii 81063' },
  { id: 'office', label: 'My Office',     icon: '🏢', detail: '4140 Parker Rd. Allentown, New Mexico 31134' },
  { id: 'apt',    label: 'My Apartment',  icon: '🏡', detail: '4517 Washington Ave. Manchester, Kentucky 39495' },
]

const DEFAULT_PAYMENTS: PaymentCard[] = [
  { id: 'paypal', label: 'PayPal',     icon: '🅿️', detail: 'andy_amolot@gmail.com', type: 'wallet', status: 'Connected' },
  { id: 'google', label: 'Google Pay', icon: '🔵', detail: 'Google account',         type: 'wallet', status: 'Connected' },
  { id: 'visa1',  label: 'Visa',       icon: '💳', detail: '•••• 4279',             type: 'card',   status: 'Complete' },
]

const ADDRESS_ICONS = ['🏠', '🏢', '🏡', '🏘️', '🏰', '🏥', '🏪', '🌍']

// ── Shared Toggle ─────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-12 h-6 rounded-full transition-colors ${on ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  )
}

// ── Theme card ────────────────────────────────────────────────
function ThemeCard({ value, label, icon, active, onClick }: { value: Theme; label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
        active ? 'border-[var(--gold)] bg-[var(--gold-bg)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)]/40'
      }`}
    >
      <span className={`text-xl ${active ? 'text-[var(--gold)]' : 'text-[var(--text-2)]'}`}>{icon}</span>
      <span className={`text-xs font-bold ${active ? 'text-[var(--gold)]' : 'text-[var(--text-2)]'}`}>{label}</span>
      {active && (
        <span className="text-[10px] font-bold text-[var(--gold)] bg-[var(--gold-bg)] border border-[var(--gold-border)] px-1.5 py-0.5 rounded-md">Active</span>
      )}
    </button>
  )
}

// ── Modal wrapper ─────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-[var(--text)] text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Input field ───────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
      />
    </div>
  )
}

// ── Main settings page ────────────────────────────────────────
export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { location, openModal } = useLocation()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<SectionTab>('profile')

  // ── Profile state ──────────────────────────────────────────
  const [profileName, setProfileName]     = useState('')
  const [profilePhone, setProfilePhone]   = useState('+234 800 0000 000')
  const [profileDOB, setProfileDOB]       = useState('Jan 1, 1995')
  const [profileSaved, setProfileSaved]   = useState(false)
  const [sidebarName, setSidebarName]     = useState('')

  // ── Address state ──────────────────────────────────────────
  const [addresses, setAddresses]         = useState<Address[]>([])
  const [showAddrModal, setShowAddrModal] = useState(false)
  const [editAddr, setEditAddr]           = useState<Address | null>(null)
  const [addrLabel, setAddrLabel]         = useState('')
  const [addrIcon, setAddrIcon]           = useState('🏠')
  const [addrDetail, setAddrDetail]       = useState('')
  const [deleteAddrId, setDeleteAddrId]   = useState<string | null>(null)

  // ── Payment state ──────────────────────────────────────────
  const [payments, setPayments]           = useState<PaymentCard[]>([])
  const [showPayModal, setShowPayModal]   = useState(false)
  const [cardNumber, setCardNumber]       = useState('')
  const [cardName, setCardName]           = useState('')
  const [cardExpiry, setCardExpiry]       = useState('')
  const [cardCVV, setCardCVV]             = useState('')
  const [deletePayId, setDeletePayId]     = useState<string | null>(null)

  // ── Notification state ─────────────────────────────────────
  const [notifState, setNotifState] = useState<Record<string, boolean>>({})

  // ── Toast state ────────────────────────────────────────────
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  // ── Security state ─────────────────────────────────────────
  const DEFAULT_SECURITY = {
    'Remember Me': true,
    'Face ID': true,
    'Biometric ID': false,
    'Google Authenticator': false,
  }
  const [securityState, setSecurityState] = useState<Record<string, boolean>>(DEFAULT_SECURITY)
  const [savedKey, setSavedKey]           = useState<string | null>(null)
  const savedKeyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function flashSaved(key: string) {
    if (savedKeyTimer.current) clearTimeout(savedKeyTimer.current)
    setSavedKey(key)
    savedKeyTimer.current = setTimeout(() => setSavedKey(null), 1200)
  }
  const [showPinModal, setShowPinModal]   = useState(false)
  const [pinCurrent, setPinCurrent]       = useState('')
  const [pinNew, setPinNew]               = useState('')
  const [pinConfirm, setPinConfirm]       = useState('')
  const [pinError, setPinError]           = useState('')
  const [pinSuccess, setPinSuccess]       = useState(false)
  const [showPwModal, setShowPwModal]     = useState(false)
  const [pwCurrent, setPwCurrent]         = useState('')
  const [pwNew, setPwNew]                 = useState('')
  const [pwConfirm, setPwConfirm]         = useState('')
  const [pwError, setPwError]             = useState('')
  const [pwSuccess, setPwSuccess]         = useState(false)

  // ── Load from localStorage on mount ───────────────────────
  useEffect(() => {
    if (authLoading || !isAuthenticated) return
    const saved = localStorage.getItem('dd_profile')
    if (saved) {
      const p = JSON.parse(saved)
      setProfileName(p.name ?? user?.name ?? '')
      setProfilePhone(p.phone ?? '+234 800 0000 000')
      setProfileDOB(p.dob ?? 'Jan 1, 1995')
      setSidebarName(p.name ?? user?.name ?? '')
    } else {
      setProfileName(user?.name ?? '')
      setSidebarName(user?.name ?? '')
    }
    const savedAddr = localStorage.getItem('dd_addresses')
    setAddresses(savedAddr ? JSON.parse(savedAddr) : DEFAULT_ADDRESSES)
    const savedPay = localStorage.getItem('dd_payments')
    setPayments(savedPay ? JSON.parse(savedPay) : DEFAULT_PAYMENTS)
    const savedNotif = localStorage.getItem('dd_notifications')
    setNotifState(savedNotif ? JSON.parse(savedNotif) : {
      'General Notification': true,
      'Sound': true,
      'Vibrate': false,
      'Special Offers': true,
      'Promo & Discount': false,
      'Payments': true,
      'Cashback': false,
      'App Updates': true,
      'New Service Available': false,
      'New Tips Available': false,
    })
    const savedSec = localStorage.getItem('dd_security')
    if (savedSec) setSecurityState(JSON.parse(savedSec))
  }, [authLoading, isAuthenticated, user])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) return null

  // ── Profile handlers ───────────────────────────────────────
  function saveProfile() {
    const p = { name: profileName, phone: profilePhone, dob: profileDOB }
    localStorage.setItem('dd_profile', JSON.stringify(p))
    setSidebarName(profileName)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  // ── Address handlers ───────────────────────────────────────
  function openAddAddr() {
    setEditAddr(null); setAddrLabel(''); setAddrIcon('🏠'); setAddrDetail('')
    setShowAddrModal(true)
  }
  function openEditAddr(addr: Address) {
    setEditAddr(addr); setAddrLabel(addr.label); setAddrIcon(addr.icon); setAddrDetail(addr.detail)
    setShowAddrModal(true)
  }
  function saveAddr() {
    if (!addrLabel.trim() || !addrDetail.trim()) return
    let updated: Address[]
    if (editAddr) {
      updated = addresses.map((a) => a.id === editAddr.id ? { ...a, label: addrLabel, icon: addrIcon, detail: addrDetail } : a)
    } else {
      updated = [...addresses, { id: Date.now().toString(), label: addrLabel, icon: addrIcon, detail: addrDetail }]
    }
    setAddresses(updated)
    localStorage.setItem('dd_addresses', JSON.stringify(updated))
    setShowAddrModal(false)
  }
  function deleteAddr(id: string) {
    const updated = addresses.filter((a) => a.id !== id)
    setAddresses(updated)
    localStorage.setItem('dd_addresses', JSON.stringify(updated))
    setDeleteAddrId(null)
  }

  // ── Payment handlers ───────────────────────────────────────
  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }
  function detectCardType(num: string): string {
    const d = num.replace(/\D/g, '')
    if (d.startsWith('4')) return 'Visa'
    if (/^5[1-5]/.test(d)) return 'Mastercard'
    if (/^3[47]/.test(d)) return 'Amex'
    if (d.startsWith('6')) return 'Verve'
    return 'Card'
  }
  function saveCard() {
    const digits = cardNumber.replace(/\D/g, '')
    if (digits.length < 16 || !cardName.trim() || cardExpiry.length < 5 || cardCVV.length < 3) return
    const last4 = digits.slice(-4)
    const type = detectCardType(digits)
    const newCard: PaymentCard = {
      id: Date.now().toString(),
      label: type,
      icon: '💳',
      detail: `•••• ${last4}`,
      type: 'card',
      status: 'Complete',
    }
    const updated = [...payments, newCard]
    setPayments(updated)
    localStorage.setItem('dd_payments', JSON.stringify(updated))
    setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCVV('')
    setShowPayModal(false)
  }
  function togglePayStatus(id: string) {
    const updated = payments.map((p) =>
      p.id === id ? { ...p, status: p.status === 'Disconnected' ? ('Complete' as const) : ('Disconnected' as const) } : p
    )
    setPayments(updated)
    localStorage.setItem('dd_payments', JSON.stringify(updated))
  }
  function deletePay(id: string) {
    const updated = payments.filter((p) => p.id !== id)
    setPayments(updated)
    localStorage.setItem('dd_payments', JSON.stringify(updated))
    setDeletePayId(null)
  }

  // ── Notification handlers ──────────────────────────────────
  function toggleNotif(key: string, val: boolean) {
    const updated = { ...notifState, [key]: val }
    setNotifState(updated)
    localStorage.setItem('dd_notifications', JSON.stringify(updated))
    showToast(`${key}: ${val ? 'On' : 'Off'} — saved`)
  }

  // ── Security toggle handlers ───────────────────────────────
  function toggleSecurity(key: string, val: boolean) {
    const updated = { ...securityState, [key]: val }
    setSecurityState(updated)
    localStorage.setItem('dd_security', JSON.stringify(updated))
    showToast(`${key}: ${val ? 'Enabled' : 'Disabled'} — saved`)
    flashSaved(key)
  }

  // ── PIN handlers ───────────────────────────────────────────
  function submitPin() {
    setPinError('')
    const saved = localStorage.getItem('dd_pin') ?? '0000'
    if (pinCurrent !== saved) { setPinError('Current PIN is incorrect'); return }
    if (pinNew.length !== 4 || !/^\d{4}$/.test(pinNew)) { setPinError('PIN must be 4 digits'); return }
    if (pinNew !== pinConfirm) { setPinError('PINs do not match'); return }
    localStorage.setItem('dd_pin', pinNew)
    setPinSuccess(true)
    setTimeout(() => { setShowPinModal(false); setPinCurrent(''); setPinNew(''); setPinConfirm(''); setPinSuccess(false) }, 1500)
  }

  // ── Password handlers ──────────────────────────────────────
  function submitPassword() {
    setPwError('')
    if (!pwCurrent) { setPwError('Enter your current password'); return }
    if (pwNew.length < 6) { setPwError('New password must be at least 6 characters'); return }
    if (pwNew !== pwConfirm) { setPwError('Passwords do not match'); return }
    setPwSuccess(true)
    setTimeout(() => { setShowPwModal(false); setPwCurrent(''); setPwNew(''); setPwConfirm(''); setPwSuccess(false) }, 1500)
  }

  return (
    <div className="relative z-10 min-h-screen">

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-nav)] backdrop-blur-md border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <Logo size={28} />
        <span className="text-lg font-black text-[var(--text)]">D<span className="text-[var(--gold)]">&</span>D</span>
        <span className="text-[var(--text-3)] mx-1">/</span>
        <span className="text-sm font-semibold text-[var(--text-2)]">Settings</span>
        <Link href="/" className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--gold)] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">

        {/* Sidebar nav */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-4 flex flex-col items-center text-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="w-20 h-20 bg-[var(--gold-bg)] border-2 border-[var(--gold-border)] rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl">👤</span>
            </div>
            <p className="font-black text-[var(--text)]">{sidebarName || user?.name || 'User'}</p>
            <p className="text-xs text-[var(--text-3)] mt-0.5">{user?.email ?? ''}</p>
            <button onClick={() => setActiveSection('profile')} className="mt-3 text-xs font-bold text-[var(--gold)] hover:underline">Edit Profile</button>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
            {SECTION_TABS.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                  i < SECTION_TABS.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''
                } ${
                  activeSection === tab.key
                    ? 'bg-[var(--gold-bg)] text-[var(--gold)]'
                    : 'text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeSection === tab.key && (
                  <svg className="ml-auto w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1 flex flex-col gap-4">

          {/* ── PROFILE ── */}
          {activeSection === 'profile' && (
            <>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="font-black text-[var(--text)] mb-4">Personal Information</h2>
                <div className="flex flex-col gap-3">
                  <Field label="Full Name" value={profileName} onChange={setProfileName} placeholder="Enter your full name" />
                  <div>
                    <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">Username</label>
                    <input
                      value={profileName.split(' ')[0].toLowerCase()}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-3)] text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">Email Address</label>
                    <input
                      value={user?.email ?? ''}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-3)] text-sm cursor-not-allowed"
                    />
                  </div>
                  <Field label="Phone Number" value={profilePhone} onChange={setProfilePhone} placeholder="+234 800 0000 000" type="tel" />
                  <Field label="Date of Birth" value={profileDOB} onChange={setProfileDOB} placeholder="Jan 1, 1995" />
                </div>
                <button
                  onClick={saveProfile}
                  className={`mt-5 w-full py-3 rounded-xl text-sm font-black transition-colors ${
                    profileSaved
                      ? 'bg-green-500 text-white'
                      : 'bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--gold-text)]'
                  }`}
                  style={{ boxShadow: 'var(--shadow-gold)' }}
                >
                  {profileSaved ? '✓ Profile Updated!' : 'Update Profile'}
                </button>
              </div>

              {/* Appearance */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="font-black text-[var(--text)] mb-4">Appearance</h2>
                <p className="text-xs text-[var(--text-3)] mb-3">Choose your colour theme</p>
                <div className="flex gap-3">
                  <ThemeCard value="system" label="System" icon="🖥️" active={theme === 'system'} onClick={() => setTheme('system')} />
                  <ThemeCard value="light"  label="Light"  icon="☀️" active={theme === 'light'}  onClick={() => setTheme('light')} />
                  <ThemeCard value="dark"   label="Dark"   icon="🌙" active={theme === 'dark'}   onClick={() => setTheme('dark')} />
                </div>
              </div>

              {/* Account */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="font-black text-[var(--text)] mb-4">Account</h2>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">Language</p>
                    <p className="text-xs text-[var(--text-3)]">English (US)</p>
                  </div>
                  <button className="text-xs font-bold text-[var(--gold)] hover:underline">Change</button>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-3">
                  <button
                    onClick={logout}
                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── ADDRESS ── */}
          {activeSection === 'address' && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-[var(--text)]">Saved Addresses</h2>
                <button
                  onClick={openAddAddr}
                  className="text-xs font-bold text-[var(--gold)] bg-[var(--gold-bg)] border border-[var(--gold-border)] px-3 py-1.5 rounded-xl hover:bg-[var(--gold)]/20 transition-colors"
                >
                  + Add New
                </button>
              </div>
              {addresses.length === 0 && (
                <p className="text-sm text-[var(--text-3)] text-center py-8">No saved addresses. Add one!</p>
              )}
              <div className="flex flex-col gap-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all">
                    <div className="w-10 h-10 bg-[var(--gold-bg)] border border-[var(--gold-border)] rounded-xl flex items-center justify-center text-lg shrink-0">
                      {addr.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--text)] text-sm">{addr.label}</p>
                      <p className="text-xs text-[var(--text-3)] mt-0.5 leading-relaxed">{addr.detail}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEditAddr(addr)} className="text-xs font-bold text-[var(--gold)] hover:underline">Edit</button>
                      <button onClick={() => setDeleteAddrId(addr.id)} className="text-xs font-bold text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PAYMENT ── */}
          {activeSection === 'payment' && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-[var(--text)]">Payment Methods</h2>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="text-xs font-bold text-[var(--gold)] bg-[var(--gold-bg)] border border-[var(--gold-border)] px-3 py-1.5 rounded-xl hover:bg-[var(--gold)]/20 transition-colors"
                >
                  + Add Card
                </button>
              </div>
              {payments.length === 0 && (
                <p className="text-sm text-[var(--text-3)] text-center py-8">No payment methods. Add a card!</p>
              )}
              <div className="flex flex-col gap-3">
                {payments.map((card) => (
                  <div key={card.id} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all">
                    <span className="text-2xl shrink-0">{card.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--text)] text-sm">{card.label}</p>
                      <p className="text-xs text-[var(--text-3)]">{card.detail}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        card.status !== 'Disconnected'
                          ? 'bg-[var(--gold-bg)] text-[var(--gold)] border border-[var(--gold-border)] hover:bg-[var(--gold)]/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                      }`}
                        onClick={() => card.type === 'card' && togglePayStatus(card.id)}
                        title={card.type === 'card' ? 'Click to toggle' : ''}
                      >
                        {card.status}
                      </span>
                      {card.type === 'card' && (
                        <button onClick={() => setDeletePayId(card.id)} className="text-xs font-bold text-red-400 hover:underline">Remove</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === 'notifications' && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <h2 className="font-black text-[var(--text)]">Notification Settings</h2>
                <p className="text-xs text-[var(--text-3)] mt-1">Changes save automatically</p>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {[
                  { label: 'General Notification', sub: 'Main notification toggle' },
                  { label: 'Sound', sub: 'Play notification sounds' },
                  { label: 'Vibrate', sub: 'Vibrate on notification' },
                  { label: 'Special Offers', sub: 'Deals and promo codes' },
                  { label: 'Promo & Discount', sub: 'Discount alerts' },
                  { label: 'Payments', sub: 'Payment confirmations' },
                  { label: 'Cashback', sub: 'Cashback earned alerts' },
                  { label: 'App Updates', sub: 'New features & updates' },
                  { label: 'New Service Available', sub: 'When new services launch' },
                  { label: 'New Tips Available', sub: 'Delivery tips & tricks' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{item.label}</p>
                      <p className="text-xs text-[var(--text-3)] mt-0.5">{item.sub}</p>
                    </div>
                    <Toggle
                      on={notifState[item.label] ?? false}
                      onChange={(v) => toggleNotif(item.label, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeSection === 'security' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="px-5 py-4 border-b border-[var(--border)]">
                  <h2 className="font-black text-[var(--text)]">Security Settings</h2>
                  <p className="text-xs text-[var(--text-3)] mt-1">Changes save automatically</p>
                </div>
                <div className="divide-y divide-[var(--border-subtle)]">
                  {[
                    { label: 'Remember Me',          sub: 'Stay signed in on this device' },
                    { label: 'Face ID',              sub: 'Use Face ID to authenticate' },
                    { label: 'Biometric ID',         sub: 'Fingerprint authentication' },
                    { label: 'Google Authenticator', sub: '2-factor authentication' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-300 ${
                        savedKey === item.label ? 'bg-[var(--gold-bg)]' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--text)]">{item.label}</p>
                        <p className="text-xs text-[var(--text-3)] mt-0.5">{item.sub}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {savedKey === item.label && (
                          <span className="text-[10px] font-bold text-[var(--gold)] animate-pulse">Saved ✓</span>
                        )}
                        <Toggle
                          on={securityState[item.label] ?? false}
                          onChange={(v) => toggleSecurity(item.label, v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="font-black text-[var(--text)] mb-4">Change Credentials</h2>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setPinError(''); setPinSuccess(false); setShowPinModal(true) }}
                    className="w-full py-3 bg-[var(--gold-bg)] border border-[var(--gold-border)] rounded-xl text-sm font-bold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-colors"
                  >
                    🔑 Change PIN
                  </button>
                  <button
                    onClick={() => { setPwError(''); setPwSuccess(false); setShowPwModal(true) }}
                    className="w-full py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text-2)] hover:border-[var(--gold)]/40 hover:text-[var(--text)] transition-colors"
                  >
                    🔐 Change Password
                  </button>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">Delivery Location</p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5">{location.flag} {location.city}, {location.country}</p>
                  </div>
                  <button onClick={openModal} className="text-xs font-bold text-[var(--gold)] hover:underline">Change</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Address Modal ─────────────────────────────────────────── */}
      {showAddrModal && (
        <Modal title={editAddr ? 'Edit Address' : 'Add New Address'} onClose={() => setShowAddrModal(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Label" value={addrLabel} onChange={setAddrLabel} placeholder="e.g. Home, Office, Gym" />
            <div>
              <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-2 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ADDRESS_ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setAddrIcon(ic)}
                    className={`w-10 h-10 rounded-xl text-xl border-2 transition-all ${addrIcon === ic ? 'border-[var(--gold)] bg-[var(--gold-bg)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)]/40'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Full Address" value={addrDetail} onChange={setAddrDetail} placeholder="Street, City, State" />
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setShowAddrModal(false)}
                className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAddr}
                disabled={!addrLabel.trim() || !addrDetail.trim()}
                className="flex-1 py-3 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-50 text-sm font-black text-[var(--gold-text)] transition-colors"
                style={{ boxShadow: 'var(--shadow-gold)' }}
              >
                {editAddr ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Address Confirm ────────────────────────────────── */}
      {deleteAddrId && (
        <Modal title="Delete Address" onClose={() => setDeleteAddrId(null)}>
          <p className="text-sm text-[var(--text-2)] mb-6">Are you sure you want to remove this address?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteAddrId(null)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
            <button onClick={() => deleteAddr(deleteAddrId)} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-black transition-colors">Delete</button>
          </div>
        </Modal>
      )}

      {/* ── Add Card Modal ────────────────────────────────────────── */}
      {showPayModal && (
        <Modal title="Add New Card" onClose={() => setShowPayModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">Card Number</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors font-mono tracking-widest"
              />
              {cardNumber.replace(/\D/g, '').length >= 1 && (
                <p className="text-xs text-[var(--gold)] mt-1 font-semibold">{detectCardType(cardNumber)}</p>
              )}
            </div>
            <Field label="Cardholder Name" value={cardName} onChange={setCardName} placeholder="Name on card" />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">Expiry</label>
                <input
                  value={cardExpiry}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d/]/g, '')
                    setCardExpiry(val.length === 2 && !val.includes('/') ? val + '/' : val)
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                />
              </div>
              <div className="w-28">
                <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">CVV</label>
                <input
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  type="password"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-1">
              <button onClick={() => setShowPayModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button
                onClick={saveCard}
                disabled={cardNumber.replace(/\D/g, '').length < 16 || !cardName.trim() || cardExpiry.length < 5 || cardCVV.length < 3}
                className="flex-1 py-3 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-50 text-sm font-black text-[var(--gold-text)] transition-colors"
                style={{ boxShadow: 'var(--shadow-gold)' }}
              >
                Add Card
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Payment Confirm ────────────────────────────────── */}
      {deletePayId && (
        <Modal title="Remove Payment Method" onClose={() => setDeletePayId(null)}>
          <p className="text-sm text-[var(--text-2)] mb-6">Are you sure you want to remove this card?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeletePayId(null)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
            <button onClick={() => deletePay(deletePayId)} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-black transition-colors">Remove</button>
          </div>
        </Modal>
      )}

      {/* ── Change PIN Modal ──────────────────────────────────────── */}
      {showPinModal && (
        <Modal title="Change PIN" onClose={() => setShowPinModal(false)}>
          <div className="flex flex-col gap-4">
            {pinSuccess ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-black text-[var(--text)]">PIN Updated!</p>
                <p className="text-sm text-[var(--text-3)] mt-1">Your PIN has been changed successfully.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">Current PIN</label>
                  <input
                    type="password"
                    value={pinCurrent}
                    onChange={(e) => setPinCurrent(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors text-center text-2xl tracking-[1rem]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">New PIN</label>
                  <input
                    type="password"
                    value={pinNew}
                    onChange={(e) => setPinNew(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors text-center text-2xl tracking-[1rem]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider mb-1.5 block">Confirm New PIN</label>
                  <input
                    type="password"
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors text-center text-2xl tracking-[1rem]"
                  />
                </div>
                {pinError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-medium">{pinError}</div>
                )}
                <p className="text-xs text-[var(--text-3)]">Default PIN for new accounts is <strong>0000</strong></p>
                <div className="flex gap-3 mt-1">
                  <button onClick={() => setShowPinModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
                  <button
                    onClick={submitPin}
                    disabled={!pinCurrent || !pinNew || !pinConfirm}
                    className="flex-1 py-3 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-50 text-sm font-black text-[var(--gold-text)] transition-colors"
                    style={{ boxShadow: 'var(--shadow-gold)' }}
                  >
                    Update PIN
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* ── Change Password Modal ─────────────────────────────────── */}
      {showPwModal && (
        <Modal title="Change Password" onClose={() => setShowPwModal(false)}>
          <div className="flex flex-col gap-4">
            {pwSuccess ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-black text-[var(--text)]">Password Updated!</p>
                <p className="text-sm text-[var(--text-3)] mt-1">Your password has been changed successfully.</p>
              </div>
            ) : (
              <>
                <Field label="Current Password" value={pwCurrent} onChange={setPwCurrent} type="password" placeholder="Enter current password" />
                <Field label="New Password" value={pwNew} onChange={setPwNew} type="password" placeholder="Min. 6 characters" />
                <Field label="Confirm New Password" value={pwConfirm} onChange={setPwConfirm} type="password" placeholder="Repeat new password" />
                {pwError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-medium">{pwError}</div>
                )}
                <div className="flex gap-3 mt-1">
                  <button onClick={() => setShowPwModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
                  <button
                    onClick={submitPassword}
                    disabled={!pwCurrent || !pwNew || !pwConfirm}
                    className="flex-1 py-3 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-50 text-sm font-black text-[var(--gold-text)] transition-colors"
                    style={{ boxShadow: 'var(--shadow-gold)' }}
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* ── Toast notification ───────────────────────────────────── */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 bg-[var(--surface)] border border-[var(--gold-border)] text-[var(--text)] text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl whitespace-nowrap">
          <span className="text-[var(--gold)]">✓</span>
          {toast}
        </div>
      </div>

    </div>
  )
}
