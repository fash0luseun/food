'use client'

import { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export function Modal({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl mx-4">
        <h2 className="mb-3 text-lg font-black text-[var(--text)]">{title}</h2>
        <div className="mb-6 text-sm text-[var(--text-2)]">{children}</div>
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-h)] text-sm font-black text-[var(--gold-text)] transition-colors"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
