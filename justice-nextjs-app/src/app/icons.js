import React from 'react';

// Common classes and styling for premium icons
const defaultProps = {
  className: "w-6 h-6",
  style: { width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle', transition: 'transform 0.3s ease' },
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

// Helper for linear gradient IDs to avoid duplication and self-contain each SVG
let gradientIdCounter = 0;
const getUniqueId = (prefix) => {
  if (typeof window === 'undefined') {
    gradientIdCounter++;
    return `${prefix}-${gradientIdCounter}`;
  }
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// 1. Briefcase / Labor Law Icon - Premium Dual Tone Gradient
export function BriefcaseIcon(props) {
  const gradId1 = "briefcase-grad-1";
  const gradId2 = "briefcase-grad-2";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId1} x1="2" y1="7" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#00c6ff" />
        </linearGradient>
        <linearGradient id={gradId2} x1="8" y1="3" x2="16" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86868b" />
          <stop offset="100%" stopColor="#1d1d1f" />
        </linearGradient>
      </defs>
      {/* Background soft glow capsule */}
      <rect x="1" y="6" width="22" height="16" rx="5" fill="#0066cc" fillOpacity="0.04" />
      {/* Handle */}
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={`url(#${gradId2})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Case body */}
      <rect x="2" y="7" width="20" height="14" rx="3" stroke={`url(#${gradId1})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Locks and details */}
      <path d="M7 11v2M17 11v2M12 7v14" stroke={`url(#${gradId1})`} strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

// 2. Shield Cross / Injury Law Icon - Glowing Red/Blue Protection
export function MedicalIcon(props) {
  const gradId = "medical-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d93838" />
          <stop offset="100%" stopColor="#ff7676" />
        </linearGradient>
      </defs>
      {/* Glow backdrop */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#d93838" fillOpacity="0.04" />
      {/* Shield border */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Red cross inside */}
      <path d="M12 8v8M8 12h8" stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 3. Balance Scale / Justice / Family Law Icon - Fine Dimensional Scaling
export function BalanceIcon(props) {
  const gradId = "balance-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="60%" stopColor="#5b5bde" />
          <stop offset="100%" stopColor="#d93838" />
        </linearGradient>
      </defs>
      {/* Support Pillar */}
      <line x1="12" y1="3" x2="12" y2="20" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 20h6" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
      {/* Balance Beam */}
      <line x1="5" y1="7" x2="19" y2="7" stroke={`url(#${gradId})`} strokeWidth="2.0" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.5" fill="#1d1d1f" />
      {/* Left scale pan */}
      <path d="M5 7l-2 7h4z" fill={`url(#${gradId})`} fillOpacity="0.1" />
      <path d="M5 7l-2 7q2 2 4 0z" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right scale pan */}
      <path d="M19 7l-2 7h4z" fill={`url(#${gradId})`} fillOpacity="0.1" />
      <path d="M19 7l-2 7q2 2 4 0z" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 4. Home / Real Estate Icon - Modern Architectural Lines
export function HomeIcon(props) {
  const gradId = "home-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="16" height="11" rx="2" fill="#0066cc" fillOpacity="0.03" />
      {/* Roof */}
      <path d="M3 10l9-7 9 7" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Walls */}
      <path d="M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door with detail */}
      <path d="M9 22v-6a3 3 0 0 1 6 0v6" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 5. User / Profile / Citizen Icon - Soft Curved Avatar
export function UserIcon(props) {
  const gradId = "user-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#00c6ff" />
        </linearGradient>
      </defs>
      {/* Backdrop */}
      <circle cx="12" cy="12" r="10" fill="#0066cc" fillOpacity="0.03" />
      {/* Head */}
      <circle cx="12" cy="8" r="3.5" stroke={`url(#${gradId})`} strokeWidth="1.8" />
      {/* Shoulders */}
      <path d="M5 19a7 7 0 0 1 14 0" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 6. Bar Chart / Evaluator Icon - Glossy Rounded Bars
export function ChartIcon(props) {
  const gradId = "chart-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="6" y1="4" x2="18" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#d93838" />
        </linearGradient>
      </defs>
      <path d="M18 20V10" stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 20V4" stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 20V14" stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" />
      {/* Underlining timeline base */}
      <path d="M3 20h18" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 7. Magnifying Glass / Search / Auditor Icon - Reflective Lens
export function SearchIcon(props) {
  const gradId = "search-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="3" y1="3" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#00c6ff" />
        </linearGradient>
      </defs>
      {/* Glowing glass center */}
      <circle cx="11" cy="11" r="6" fill="#0066cc" fillOpacity="0.04" />
      {/* Rim */}
      <circle cx="11" cy="11" r="7" stroke={`url(#${gradId})`} strokeWidth="1.8" />
      {/* Handle */}
      <path d="M21 21l-5.2-5.2" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 8. Open Book / Precedents Icon - Curved Leather Bound
export function BookIcon(props) {
  const gradId = "book-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="50%" stopColor="#515154" />
          <stop offset="100%" stopColor="#d93838" />
        </linearGradient>
      </defs>
      {/* Book pages */}
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="#0066cc" fillOpacity="0.03" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="#d93838" fillOpacity="0.03" />
      {/* Cover edges */}
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 9. Bolt / Integration / Legal Tech Icon - Neomorphic Flash
export function BoltIcon(props) {
  const gradId = "bolt-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d93838" />
        </linearGradient>
      </defs>
      {/* Glow shadow */}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="url(#bolt-grad)" fillOpacity="0.06" />
      {/* Bolt body */}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 10. Gear / Settings / Toggle Icon - Machined Radial Depth
export function GearIcon(props) {
  const gradId = "gear-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86868b" />
          <stop offset="100%" stopColor="#1d1d1f" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3" stroke={`url(#${gradId})`} strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// 11. Government / Courthouse Facade / National Insurance Icon - Neoclassic Columns
export function CourtIcon(props) {
  const gradId = "court-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="16" height="11" rx="1" fill="#0066cc" fillOpacity="0.04" />
      {/* Foundation & Roof */}
      <path d="M3 21h18M3 10h18M5 6l7-4 7 4" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pillars */}
      <path d="M8 10v11M12 10v11M16 10v11" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 12. Clock / Time / History Icon - Precision Watch Dial
export function ClockIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="10" stroke="#1d1d1f" strokeWidth="1.8" fill="#1d1d1f" fillOpacity="0.02" />
      <polyline points="12 6 12 12 16 14" stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 13. Lock / Security Icon - Hardened Padlock
export function LockIcon(props) {
  const gradId = "lock-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="3" y1="11" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect x="3" y="11" width="18" height="10" rx="2" fill="url(#lock-grad)" fillOpacity="0.06" />
      <rect x="3" y="11" width="18" height="10" rx="2" stroke={`url(#${gradId})`} strokeWidth="1.8" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 14. Star / Rating Icon - Radiant Golden Emblem
export function StarIcon(props) {
  const gradId = "star-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#${gradId})`} stroke={`url(#${gradId})`} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

// 15. Check Circle / Success Icon - Neon Success Ring
export function CheckIcon(props) {
  const gradId = "check-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="#10b981" fillOpacity="0.04" />
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke={`url(#${gradId})`} strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 16. Arrow Left / Return Icon - Apple Backwards Navigation
export function ArrowLeftIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <line x1="20" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="11 19 4 12 11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 17. Phone / Call Icon - Sleek Vector Wavefront
export function PhoneIcon(props) {
  const gradId = "phone-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 18. Mail / Email Icon - Sealed Envelope
export function MailIcon(props) {
  const gradId = "mail-grad";
  return (
    <svg {...defaultProps} {...props}>
      <defs>
        <linearGradient id={gradId} x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#5b5bde" />
        </linearGradient>
      </defs>
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#0066cc" fillOpacity="0.02" />
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={`url(#${gradId})`} strokeWidth="1.8" />
      <polyline points="22,6 12,13 2,6" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
