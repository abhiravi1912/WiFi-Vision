import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', iconOnly = false, size = 'md' }: LogoProps) {
  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-base', markSize: 28 },
    md: { icon: 'w-8 h-8', text: 'text-lg', markSize: 32 },
    lg: { icon: 'w-10 h-10', text: 'text-xl', markSize: 40 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Mark: Vision Iris + Wi-Fi Signal Waves */}
      <div className={`relative ${dimensions.icon} flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 shadow-sm shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all duration-200`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wv-logo-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E0E7FF" />
            </linearGradient>
          </defs>

          {/* Wi-Fi Wave Arcs forming Vision Aperture */}
          <path
            d="M 6 12 C 11 6, 21 6, 26 12"
            stroke="url(#wv-logo-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M 9.5 16 C 13.5 11.5, 18.5 11.5, 22.5 16"
            stroke="url(#wv-logo-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 12.5 19.5 C 14.5 17, 17.5 17, 19.5 19.5"
            stroke="url(#wv-logo-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Sensing Core / Pupil */}
          <circle cx="16" cy="22" r="2.2" fill="url(#wv-logo-grad)" />

          {/* Subtle Radar/Sensing Radar Ring */}
          <circle cx="16" cy="17" r="13" stroke="white" strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />
        </svg>
      </div>

      {!iconOnly && (
        <span className={`${dimensions.text} font-bold tracking-tight text-slate-900 dark:text-white`}>
          WiFi <span className="text-accent font-semibold">Vision</span>
        </span>
      )}
    </div>
  );
}
