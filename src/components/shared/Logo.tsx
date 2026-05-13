interface LogoProps {
  variant?: "compact" | "icon"
  className?: string
}

/**
 * Compact navbar variant — left bar + TF monogram + TAXFLOW / BANGLADESH stack.
 * Matches format 05 from the brand SVG spec.
 */
function LogoCompact({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 158 44"
      height="36"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TaxFlowBD"
      className={`block ${className ?? ""}`}
    >
      {/* left accent bar */}
      <rect x="0" y="4" width="5" height="36" rx="2.5" fill="currentColor" />

      {/* TF monogram */}
      <text
        x="14"
        y="36"
        fill="currentColor"
        fontSize="28"
        fontWeight="900"
        fontFamily="Georgia, serif"
        letterSpacing="-2"
      >
        TF
      </text>

      {/* vertical separator */}
      <rect x="54" y="9" width="1" height="26" rx="0.5" fill="currentColor" opacity="0.2" />

      {/* TAXFLOW */}
      <text
        x="64"
        y="23"
        fill="currentColor"
        fontSize="11"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.2em"
      >
        TAXFLOW
      </text>

      {/* BANGLADESH */}
      <text
        x="64"
        y="37"
        fill="currentColor"
        fontSize="8.5"
        fontWeight="400"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.15em"
        opacity="0.45"
      >
        BANGLADESH
      </text>
    </svg>
  )
}

/**
 * Icon-only mark — left bar + TF monogram.
 * Used for collapsed states and mobile hamburger area.
 */
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 36"
      height="28"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TaxFlowBD"
      className={`block ${className ?? ""}`}
    >
      <rect x="0" y="2" width="4" height="32" rx="2" fill="currentColor" />
      <text
        x="12"
        y="30"
        fill="currentColor"
        fontSize="24"
        fontWeight="900"
        fontFamily="Georgia, serif"
        letterSpacing="-1.5"
      >
        TF
      </text>
    </svg>
  )
}

export function Logo({ variant = "compact", className }: LogoProps) {
  if (variant === "icon") return <LogoIcon className={className} />
  return <LogoCompact className={className} />
}
