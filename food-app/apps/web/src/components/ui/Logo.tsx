export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gold frame */}
      <rect width="56" height="56" rx="14" fill="#D4AF37" />
      {/* Premium dark inner background */}
      <rect x="2.5" y="2.5" width="51" height="51" rx="11.5" fill="#09090E" />

      {/* Subtle inner glow */}
      <rect
        x="2.5" y="2.5" width="51" height="51" rx="11.5"
        fill="url(#logoGlow)"
        opacity="0.4"
      />

      {/* Left D — vertical bar */}
      <rect x="9" y="14" width="4.5" height="28" rx="2.25" fill="#D4AF37" />
      {/* Left D — bow (cubic bezier curving right) */}
      <path
        d="M13.5,14 C28,14 28,42 13.5,42"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Diamond separator */}
      <path d="M28,22 L32.5,28 L28,34 L23.5,28 Z" fill="#D4AF37" />

      {/* Right D (mirrored) — vertical bar */}
      <rect x="42.5" y="14" width="4.5" height="28" rx="2.25" fill="#D4AF37" />
      {/* Right D — bow (mirrored, curving left) */}
      <path
        d="M42.5,14 C28,14 28,42 42.5,42"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      <defs>
        <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
