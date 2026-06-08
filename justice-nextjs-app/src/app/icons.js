import React from 'react';

// Common classes and styling for premium icons
const defaultProps = {
  className: "w-6 h-6",
  style: { width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle', transition: 'transform 0.3s ease' },
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

// 1. Briefcase / Labor Law Icon - Premium Monochromatic
export function BriefcaseIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Background soft glow capsule */}
      <rect x="1" y="6" width="22" height="16" rx="5" fill="#86868b" fillOpacity="0.04" />
      {/* Handle */}
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Case body */}
      <rect x="2" y="7" width="20" height="14" rx="3" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Locks and details */}
      <path d="M7 11v2M17 11v2M12 7v14" stroke="#1d1d1f" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

// 2. Shield Cross / Injury Law Icon - Premium Monochromatic
export function MedicalIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Glow backdrop */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#86868b" fillOpacity="0.04" />
      {/* Shield border */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cross inside */}
      <path d="M12 8v8M8 12h8" stroke="#86868b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 3. Balance Scale / Justice / Family Law Icon - Premium Monochromatic
export function BalanceIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Support Pillar */}
      <line x1="12" y1="3" x2="12" y2="20" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 20h6" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
      {/* Balance Beam */}
      <line x1="5" y1="7" x2="19" y2="7" stroke="#1d1d1f" strokeWidth="2.0" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.5" fill="#1d1d1f" />
      {/* Left scale pan */}
      <path d="M5 7l-2 7h4z" fill="#86868b" fillOpacity="0.1" />
      <path d="M5 7l-2 7q2 2 4 0z" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right scale pan */}
      <path d="M19 7l-2 7h4z" fill="#86868b" fillOpacity="0.1" />
      <path d="M19 7l-2 7q2 2 4 0z" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 4. Home / Real Estate Icon - Premium Monochromatic
export function HomeIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2" fill="#86868b" fillOpacity="0.03" />
      {/* Roof */}
      <path d="M3 10l9-7 9 7" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Walls */}
      <path d="M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door with detail */}
      <path d="M9 22v-6a3 3 0 0 1 6 0v6" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 5. User / Profile / Citizen Icon - Premium Monochromatic
export function UserIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Backdrop */}
      <circle cx="12" cy="12" r="10" fill="#86868b" fillOpacity="0.03" />
      {/* Head */}
      <circle cx="12" cy="8" r="3.5" stroke="#1d1d1f" strokeWidth="1.8" />
      {/* Shoulders */}
      <path d="M5 19a7 7 0 0 1 14 0" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 6. Bar Chart / Evaluator Icon - Premium Monochromatic
export function ChartIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M18 20V10" stroke="#86868b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 20V4" stroke="#1d1d1f" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 20V14" stroke="#86868b" strokeWidth="2.2" strokeLinecap="round" />
      {/* Underlining timeline base */}
      <path d="M3 20h18" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 7. Magnifying Glass / Search / Auditor Icon - Premium Monochromatic
export function SearchIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Glowing glass center */}
      <circle cx="11" cy="11" r="6" fill="#86868b" fillOpacity="0.04" />
      {/* Rim */}
      <circle cx="11" cy="11" r="7" stroke="#1d1d1f" strokeWidth="1.8" />
      {/* Handle */}
      <path d="M21 21l-5.2-5.2" stroke="#86868b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 8. Open Book / Precedents Icon - Premium Monochromatic
export function BookIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Book pages */}
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="#86868b" fillOpacity="0.03" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="#86868b" fillOpacity="0.03" />
      {/* Cover edges */}
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 9. Bolt / Integration / Legal Tech Icon - Premium Monochromatic
export function BoltIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      {/* Glow shadow */}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#86868b" fillOpacity="0.06" />
      {/* Bolt body */}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 10. Gear / Settings / Toggle Icon - Premium Monochromatic
export function GearIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="3" stroke="#86868b" strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#1d1d1f" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// 11. Government / Courthouse Facade / National Insurance Icon - Premium Monochromatic
export function CourtIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <rect x="4" y="10" width="16" height="11" rx="1" fill="#86868b" fillOpacity="0.04" />
      {/* Foundation & Roof */}
      <path d="M3 21h18M3 10h18M5 6l7-4 7 4" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pillars */}
      <path d="M8 10v11M12 10v11M16 10v11" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 12. Clock / Time / History Icon - Premium Monochromatic
export function ClockIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="10" stroke="#1d1d1f" strokeWidth="1.8" fill="#1d1d1f" fillOpacity="0.02" />
      <polyline points="12 6 12 12 16 14" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 13. Lock / Security Icon - Premium Monochromatic
export function LockIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" fill="#86868b" fillOpacity="0.06" />
      <rect x="3" y="11" width="18" height="10" rx="2" stroke="#1d1d1f" strokeWidth="1.8" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 14. Star / Rating Icon - Premium Monochromatic
export function StarIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#86868b" stroke="#86868b" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

// 15. Check Circle / Success Icon - Premium Monochromatic
export function CheckIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="10" fill="#86868b" fillOpacity="0.04" />
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="#86868b" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
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

// 17. Phone / Call Icon - Premium Monochromatic
export function PhoneIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 18. Mail / Email Icon - Premium Monochromatic
export function MailIcon(props) {
  return (
    <svg {...defaultProps} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#86868b" fillOpacity="0.02" />
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#1d1d1f" strokeWidth="1.8" />
      <polyline points="22,6 12,13 2,6" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
