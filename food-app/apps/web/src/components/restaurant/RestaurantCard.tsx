import Link from 'next/link'
import type { Restaurant } from '@food-app/shared'
import { formatPrice } from '@/lib/utils'

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="group bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)]/40 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-[0_0_20px_var(--gold-bg)]">

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-[var(--surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {!restaurant.isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <span className="rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-1.5 text-sm font-bold text-[var(--text-2)]">
                Closed
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="rounded-xl bg-black/70 backdrop-blur-sm border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--gold)]">
              {restaurant.cuisine}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 rounded-xl bg-black/70 backdrop-blur-sm border border-[var(--border)] px-2.5 py-1 text-xs font-bold text-white">
              <span className="text-[var(--gold)]">★</span>
              {restaurant.rating}
              <span className="text-white/60 font-normal">({restaurant.reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-[var(--text)] text-base leading-tight group-hover:text-[var(--gold)] transition-colors">
            {restaurant.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-3)] line-clamp-1">{restaurant.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-3)]">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-[var(--text-2)]">{restaurant.deliveryTime}</span>
            </div>
            <span className="text-[var(--border)]">•</span>
            <span>{formatPrice(restaurant.deliveryFee)} delivery</span>
            <span className="text-[var(--border)]">•</span>
            <span>Min. {formatPrice(restaurant.minimumOrder)}</span>
          </div>
          {restaurant.deliveryFee === 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--gold-bg)] border border-[var(--gold-border)] px-2 py-0.5 text-xs font-semibold text-[var(--gold)]">
                Free delivery
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
