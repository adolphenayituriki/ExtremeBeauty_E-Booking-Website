import React from 'react';

const LogoSVG = ({ className = '', variant = 'dark' }) => {
  const color = variant === 'dark' ? '#1a1a1a' : '#ffffff';
  const gold = '#b8956a';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 140" className={className} fill="none">
      {/* ===== DECORATIVE CAPITAL E ===== */}
      <g transform="translate(8, 5)">
        {/* E - Main vertical stem with slight curve */}
        <path
          d="M 52 18 C 50 18, 48 20, 47 25 L 45 85 C 44 92, 46 98, 50 102"
          stroke={color} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />

        {/* E - Upper horizontal bar */}
        <path
          d="M 47 25 L 14 25"
          stroke={color} strokeWidth="2.8" fill="none" strokeLinecap="round"
        />

        {/* E - Upper left decorative swash - long looping flourish */}
        <path
          d="M 14 25 C 8 24, 2 20, -2 14 C -5 9, -4 4, 0 2 C 4 0, 10 3, 12 8 C 14 12, 13 18, 14 25"
          stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
        />

        {/* E - Upper swash extending far left with loop */}
        <path
          d="M -2 14 C -8 10, -16 8, -20 12 C -23 15, -20 20, -15 20 C -10 20, -5 17, 0 14"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"
        />

        {/* E - Upper thin hairline flourish curving right */}
        <path
          d="M 14 25 C 18 20, 25 16, 32 18 C 36 19, 38 22, 36 25"
          stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"
        />

        {/* E - Middle horizontal bar with slight wave */}
        <path
          d="M 47 62 C 40 61, 28 58, 16 60 C 10 61, 8 64, 12 66 C 18 68, 30 66, 40 64"
          stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"
        />

        {/* E - Lower horizontal bar */}
        <path
          d="M 47 85 L 14 85"
          stroke={color} strokeWidth="2.8" fill="none" strokeLinecap="round"
        />

        {/* E - Lower left decorative swash */}
        <path
          d="M 14 85 C 8 86, 2 90, -2 96 C -5 100, -4 106, 0 108 C 4 110, 10 107, 12 102 C 14 98, 13 92, 14 85"
          stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
        />

        {/* E - Lower swash extending far left */}
        <path
          d="M -2 96 C -8 100, -16 102, -20 98 C -23 95, -20 90, -15 90 C -10 90, -5 93, 0 96"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"
        />

        {/* E - Lower thin hairline flourish */}
        <path
          d="M 14 85 C 18 90, 25 94, 32 92 C 36 91, 38 88, 36 85"
          stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"
        />

        {/* E - Serif at top of stem */}
        <path
          d="M 52 18 C 54 16, 56 16, 58 18"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"
        />

        {/* E - Serif at bottom of stem */}
        <path
          d="M 50 102 C 52 104, 54 104, 56 102"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
      </g>

      {/* ===== LETTERS "xtreme" ===== */}
      <g transform="translate(75, 0)">
        {/* x - first letter */}
        <g transform="translate(0, 15)">
          {/* x - stroke 1 (top-left to bottom-right) */}
          <path d="M 2 20 C 8 30, 18 50, 30 72" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* x - stroke 2 (top-right to bottom-left) */}
          <path d="M 30 20 C 24 30, 14 50, 2 72" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* x - thin hairline accents */}
          <path d="M 5 25 C 10 28, 15 32, 18 36" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M 27 25 C 22 28, 17 32, 14 36" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          {/* x - serifs */}
          <path d="M 0 18 C 2 16, 4 16, 6 18" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M 28 18 C 30 16, 32 16, 34 18" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M 0 74 C 2 76, 4 76, 6 74" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M 28 74 C 30 76, 32 76, 34 74" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </g>

        {/* t */}
        <g transform="translate(42, 15)">
          {/* t - vertical stem */}
          <path d="M 14 8 L 14 75" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* t - crossbar */}
          <path d="M 4 28 L 26 28" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* t - top serif */}
          <path d="M 10 8 C 12 5, 16 5, 18 8" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          {/* t - bottom curve */}
          <path d="M 14 75 C 14 78, 16 80, 20 80 C 24 80, 26 78, 26 75" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* t - thin hairline */}
          <path d="M 14 15 C 16 18, 18 22, 18 26" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.4"/>
        </g>

        {/* r */}
        <g transform="translate(80, 15)">
          {/* r - vertical stem */}
          <path d="M 4 20 L 4 72" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* r - shoulder curve */}
          <path d="M 4 35 C 4 28, 8 22, 14 20 C 18 18, 22 20, 22 24" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          {/* r - thin hairline descending */}
          <path d="M 22 24 C 20 30, 18 38, 16 48" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          {/* r - serif */}
          <path d="M 2 20 C 4 18, 6 18, 8 20" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </g>

        {/* e */}
        <g transform="translate(112, 15)">
          {/* e - main bowl */}
          <path d="M 22 48 C 18 52, 10 55, 4 50 C -2 44, -2 34, 4 28 C 10 22, 18 22, 24 26 C 28 29, 30 34, 28 40 L 0 40" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          {/* e - thin hairline inside */}
          <path d="M 8 32 C 12 28, 18 28, 22 30" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          {/* e - bottom serif */}
          <path d="M 2 52 C 4 54, 6 54, 8 52" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </g>

        {/* m */}
        <g transform="translate(148, 15)">
          {/* m - first arch */}
          <path d="M 2 72 L 2 28 C 2 22, 6 18, 12 18 C 18 18, 22 22, 22 28 L 22 72" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          {/* m - second arch */}
          <path d="M 22 72 L 22 32 C 22 26, 26 22, 32 22 C 38 22, 42 26, 42 32 L 42 72" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          {/* m - thin hairlines */}
          <path d="M 8 22 C 10 20, 12 20, 14 22" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M 28 22 C 30 20, 32 20, 34 22" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          {/* m - serifs */}
          <path d="M 0 72 C 2 74, 4 74, 6 72" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M 18 72 C 20 74, 22 74, 24 72" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M 38 72 C 40 74, 42 74, 44 72" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </g>

        {/* e - final */}
        <g transform="translate(200, 15)">
          <path d="M 22 48 C 18 52, 10 55, 4 50 C -2 44, -2 34, 4 28 C 10 22, 18 22, 24 26 C 28 29, 30 34, 28 40 L 0 40" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 8 32 C 12 28, 18 28, 22 30" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M 2 52 C 4 54, 6 54, 8 52" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </g>
      </g>

      {/* ===== TAGLINE: BEAUTY LASHES & BROWS ===== */}
      <text
        x="210" y="125"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="400"
        fontSize="11"
        fill={gold}
        letterSpacing="6"
        textAnchor="middle"
      >
        BEAUTY LASHES &amp; BROWS
      </text>

      {/* Subtle gold accent line */}
      <line x1="130" y1="132" x2="290" y2="132" stroke={gold} strokeWidth="0.5" opacity="0.35"/>
    </svg>
  );
};

export default LogoSVG;
