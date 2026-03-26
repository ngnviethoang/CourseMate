export function CourseMateLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cm-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="url(#cm-grad)" />
      {/* Open book */}
      <path
        d="M8 27V14c0-.6.4-1 1-1 3.5 0 6.5 1.2 8.5 3v12c-2-1.5-5-2.5-8.5-2.5-.6 0-1-.4-1-1Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M32 27V14c0-.6-.4-1-1-1-3.5 0-6.5 1.2-8.5 3v12c2-1.5 5-2.5 8.5-2.5.6 0 1-.4 1-1Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path d="M17.5 16L22.5 16" stroke="white" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
      {/* Graduation cap */}
      <path
        d="M20 9L28 13L20 17L12 13L20 9Z"
        fill="white"
        fillOpacity="1"
      />
      <path
        d="M26 14.5V20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="26" cy="20.5" r="1.2" fill="white" />
      {/* Center spine */}
      <line x1="20" y1="16" x2="20" y2="28" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
    </svg>
  )
}
