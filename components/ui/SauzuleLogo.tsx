export function SauzuleLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 3C20 3 12 10 12 18c0 3.2 1.5 6 3.8 7.8" stroke="#b8985a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 3C20 3 28 10 28 18c0 3.2-1.5 6-3.8 7.8" stroke="#d4b378" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 18c2-1.3 4.5-2 8-2s6 .7 8 2" stroke="#b8985a" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M16 25.8C17 27.6 18.4 29.2 20 30.5c1.6-1.3 3-2.9 4-4.7" stroke="#b8985a" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 30C17.2 33 18.6 35.5 20 37.5c1.4-2 2.8-4.5 4-7.5" stroke="#d4b378" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="18" r="2.2" fill="#b8985a"/>
      <circle cx="12" cy="18" r="1.4" fill="#b8985a" opacity="0.6"/>
      <circle cx="28" cy="18" r="1.4" fill="#b8985a" opacity="0.6"/>
    </svg>
  )
}
