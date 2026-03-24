export const BrandLogo = ({ compact = false }) => {
  return (
    <div className={`brand-logo ${compact ? "compact" : ""}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="brand-logo-mark">
        <defs>
          <linearGradient id="brandLogoFill" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#64a8ff" />
            <stop offset="100%" stopColor="#0071e3" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="52" height="52" rx="18" fill="url(#brandLogoFill)" />
        <path
          d="M20 40V24.5C20 22.567 21.567 21 23.5 21H40"
          fill="none"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 39L31.5 31.5L36 36L45 25.5"
          fill="none"
          stroke="rgba(255,255,255,0.98)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="brand-logo-copy">
        <strong>FinTrack</strong>
        {!compact ? <span>Personal Finance Intelligence</span> : null}
      </div>
    </div>
  );
};
