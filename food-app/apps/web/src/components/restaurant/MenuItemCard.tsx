'use client'

import type { MenuItem } from '@food-app/shared'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

const TRIBE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Yoruba:  { bg: 'bg-green-500/15',  text: 'text-green-600 dark:text-green-400',  border: 'border-green-500/30' },
  Igbo:    { bg: 'bg-blue-500/15',   text: 'text-blue-600 dark:text-blue-400',    border: 'border-blue-500/30' },
  Hausa:   { bg: 'bg-orange-500/15', text: 'text-orange-600 dark:text-orange-400',border: 'border-orange-500/30' },
  Efik:    { bg: 'bg-purple-500/15', text: 'text-purple-600 dark:text-purple-400',border: 'border-purple-500/30' },
  Urhobo:  { bg: 'bg-teal-500/15',   text: 'text-teal-600 dark:text-teal-400',    border: 'border-teal-500/30' },
  Ijaw:    { bg: 'bg-red-500/15',    text: 'text-red-600 dark:text-red-400',       border: 'border-red-500/30' },
}

const TRIBE_REGION: Record<string, string> = {
  Yoruba: 'South-West',
  Igbo:   'South-East',
  Hausa:  'North',
  Efik:   'South-South',
  Urhobo: 'Delta',
  Ijaw:   'Bayelsa',
}

export function MenuItemCard({
  item,
  restaurantId,
  variant = 'row',
}: {
  item: MenuItem
  restaurantId: string
  variant?: 'row' | 'grid'
}) {
  const { addItem, items, increment, decrement } = useCart()
  const cartItem = items.find((ci) => ci.menuItemId === item.id)
  const quantity = cartItem?.quantity ?? 0
  const tribeStyle = item.tribe ? TRIBE_STYLES[item.tribe] : null

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      restaurantId,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    })
  }

  const qtyControls = (
    !item.isAvailable ? (
      <span className="text-xs text-[var(--text-3)] font-medium">Unavailable</span>
    ) : quantity === 0 ? (
      <button
        onClick={handleAdd}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--gold-text)] font-black text-xl transition-all active:scale-95"
        style={{ boxShadow: 'var(--shadow-gold)' }}
      >
        +
      </button>
    ) : (
      <div className="flex items-center gap-2">
        <button
          onClick={() => decrement(item.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[var(--gold)]/60 text-[var(--gold)] font-bold text-lg hover:bg-[var(--gold-bg)] transition-colors"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-black text-[var(--text)]">{quantity}</span>
        <button
          onClick={() => increment(item.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--gold-text)] font-bold text-lg transition-colors"
        >
          +
        </button>
      </div>
    )
  )

  if (variant === 'grid') {
    return (
      <div className={`flex flex-col rounded-2xl bg-[var(--surface)] border overflow-hidden transition-all ${
        !item.isAvailable
          ? 'border-[var(--border)] opacity-50'
          : 'border-[var(--border)] hover:border-[var(--gold)]/40 hover:shadow-lg'
      }`} style={{ boxShadow: 'var(--shadow-sm)' }}>
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[var(--surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          {/* Tribe badge overlay */}
          {tribeStyle && item.tribe && (
            <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border backdrop-blur-sm ${tribeStyle.bg} ${tribeStyle.text} ${tribeStyle.border}`}>
              🏷 {item.tribe}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex flex-col gap-0.5">
            <h4 className="font-bold text-[var(--text)] text-sm leading-snug line-clamp-1">{item.name}</h4>
            {item.tribe && (
              <p className="text-[11px] text-[var(--text-3)] font-medium">
                {TRIBE_REGION[item.tribe] ?? ''} · {item.tribe} cuisine
              </p>
            )}
          </div>
          <p className="text-xs text-[var(--text-3)] line-clamp-2 leading-relaxed flex-1">{item.description}</p>
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-[var(--border)]">
            <span className="text-base font-black text-[var(--gold)]">{formatPrice(item.price)}</span>
            {qtyControls}
          </div>
        </div>
      </div>
    )
  }

  // Default row variant (used in restaurant detail page)
  return (
    <div className={`flex items-center gap-4 rounded-2xl bg-[var(--surface)] border p-4 transition-all ${
      !item.isAvailable
        ? 'border-[var(--border-subtle)] opacity-50'
        : 'border-[var(--border)] hover:border-[var(--gold)]/30'
    }`}>
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover opacity-90" />
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-bold text-[var(--text)] text-base leading-tight">{item.name}</h4>
          {tribeStyle && item.tribe && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${tribeStyle.bg} ${tribeStyle.text} ${tribeStyle.border}`}>
              {item.tribe}
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-3)] line-clamp-2 leading-snug">{item.description}</p>
        <span className="text-base font-black text-[var(--gold)] mt-1">{formatPrice(item.price)}</span>
      </div>

      <div className="shrink-0">{qtyControls}</div>
    </div>
  )
}
