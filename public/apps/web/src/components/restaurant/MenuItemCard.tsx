'use client'

import type { MenuItem } from '@food-app/shared'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export function MenuItemCard({
  item,
  restaurantId,
}: {
  item: MenuItem
  restaurantId: string
}) {
  const { addItem, items, increment, decrement } = useCart()
  const cartItem = items.find((ci) => ci.menuItemId === item.id)
  const quantity = cartItem?.quantity ?? 0

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

  return (
    <div className={`flex items-center gap-4 rounded-2xl bg-[var(--surface)] border p-4 transition-all ${
      !item.isAvailable
        ? 'border-[var(--border-subtle)] opacity-50'
        : 'border-[var(--border)] hover:border-[var(--gold)]/30'
    }`}>
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover opacity-90" />
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <h4 className="font-bold text-[var(--text)] text-base leading-tight">{item.name}</h4>
        <p className="text-sm text-[var(--text-3)] line-clamp-2 leading-snug">{item.description}</p>
        <span className="text-base font-black text-[var(--gold)] mt-1">{formatPrice(item.price)}</span>
      </div>

      <div className="shrink-0">
        {!item.isAvailable ? (
          <span className="text-xs text-[var(--text-3)] font-medium">Unavailable</span>
        ) : quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-h)] text-[var(--gold-text)] font-black text-xl transition-all active:scale-95"
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
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-h)] text-[var(--gold-text)] font-bold text-lg transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
