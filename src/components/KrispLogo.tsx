import React from 'react';

interface KrispLogoProps {
  className?: string;
  size?: number;
}

export function KrispLogo({ className = "w-6 h-6", size = 24 }: KrispLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="url(#krisp_gradient)" />
      <path
        d="M10 12V20M14 8V24M18 10V22M22 14V18"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="krisp_gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#EC4899" />
          <stop offset="1" stopColor="#F43F5E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default KrispLogo;
