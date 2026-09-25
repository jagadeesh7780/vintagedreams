import React from 'react';

/**
 * NeutralHumanStructure - Phase 2 & Core Architectural Foundation
 * 
 * Renders a clean, high-precision neutral anatomical human silhouette / mannequin
 * with clearly visible Head, Face, Neck, Shoulders, Arms, Hands, Chest, Torso, Waist, Hips, Legs, Knees, and Feet.
 * Does NOT display pre-dressed models or default clothes.
 */
const NeutralHumanStructure = ({ 
  silhouetteType = 'neutral', // 'neutral' | 'feminine' | 'masculine'
  showLandmarks = false,
  activeTargetPart = null,
  className = '' 
}) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      
      {/* Studio Lighting Background Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-800/40 via-slate-900/80 to-slate-950 pointer-events-none"></div>

      {/* Anatomical Human SVG Vector Silhouette */}
      <svg
        viewBox="0 0 300 650"
        className="w-full h-full max-h-[92%] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Studio Mannequin Gradient */}
          <linearGradient id="mannequinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#1e293b" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </linearGradient>

          {/* Target Zone Highlight Gradient */}
          <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.05" />
          </linearGradient>

          {/* Silhouette Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================= */}
        {/* 1. ANATOMICAL BODY SILHOUETTE OUTLINE                   */}
        {/* ======================================================= */}
        <g id="humanSilhouette" fill="url(#mannequinGrad)" stroke="#475569" strokeWidth="1.5">
          
          {/* Head & Face */}
          <ellipse cx="150" cy="52" rx="24" ry="32" id="bodyHead" />
          
          {/* Neck */}
          <path d="M 142 82 L 142 104 L 158 104 L 158 82 Z" id="bodyNeck" />

          {/* Shoulders, Chest & Torso */}
          <path 
            d={
              silhouetteType === 'feminine'
                ? "M 142 104 C 115 108 98 122 84 148 C 76 164 74 195 72 230 C 70 250 68 285 64 320 C 60 345 56 370 52 385 C 48 395 56 400 62 392 C 72 375 78 340 82 305 C 86 270 90 235 94 205 C 104 200 114 195 125 195 C 135 195 140 205 140 220 L 140 280 C 130 300 120 315 110 350 L 190 350 C 180 315 170 300 160 280 L 160 220 C 160 205 165 195 175 195 C 186 195 196 200 206 205 C 210 235 214 270 218 305 C 222 340 228 375 238 392 C 244 400 252 395 248 385 C 244 370 240 345 236 320 C 232 285 230 250 228 230 C 226 195 224 164 216 148 C 202 122 185 108 158 104 Z"
                : "M 142 104 C 110 108 90 124 74 150 C 66 166 64 195 62 230 C 60 255 58 290 54 330 C 50 355 46 380 42 395 C 38 405 46 410 52 402 C 62 385 68 350 72 315 C 76 275 80 235 84 205 C 98 198 112 192 125 190 L 138 275 L 115 350 L 185 350 L 162 275 L 175 190 C 188 192 202 198 216 205 C 220 235 224 275 228 315 C 232 350 238 385 248 402 C 254 410 262 405 258 395 C 254 380 250 355 246 330 C 242 290 240 255 238 230 C 236 195 234 166 226 150 C 210 124 190 108 158 104 Z"
            }
            id="bodyTorsoArms" 
          />

          {/* Left Leg & Foot */}
          <path 
            d="M 112 350 C 108 390 106 440 108 480 C 110 520 112 560 110 600 C 108 615 100 625 96 630 C 94 635 105 638 118 636 C 128 634 130 625 128 610 C 126 570 126 530 128 480 C 130 435 136 390 144 350 Z"
            id="bodyLeftLeg"
          />

          {/* Right Leg & Foot */}
          <path 
            d="M 188 350 C 192 390 194 440 192 480 C 190 520 188 560 190 600 C 192 615 200 625 204 630 C 206 635 195 638 182 636 C 172 634 170 625 172 610 C 174 570 174 530 172 480 C 170 435 164 390 156 350 Z"
            id="bodyRightLeg"
          />

        </g>

        {/* ======================================================= */}
        {/* 2. SUBTLE ANATOMICAL CONTOUR & GRID LINES               */}
        {/* ======================================================= */}
        <g stroke="#64748b" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6">
          {/* Clavicle / Shoulder Line */}
          <line x1="100" y1="118" x2="200" y2="118" />
          
          {/* Chest Line */}
          <line x1="110" y1="165" x2="190" y2="165" />
          
          {/* Waist Line */}
          <line x1="125" y1="240" x2="175" y2="240" />

          {/* Hip Line */}
          <line x1="110" y1="350" x2="190" y2="350" />

          {/* Knee Level */}
          <line x1="102" y1="480" x2="198" y2="480" />

          {/* Center Vertical Guideline */}
          <line x1="150" y1="20" x2="150" y2="635" stroke="#f43f5e" strokeWidth="0.5" opacity="0.4" />
        </g>

        {/* ======================================================= */}
        {/* 3. ACTIVE TARGET BODY REGION HIGHLIGHT ZONE             */}
        {/* ======================================================= */}
        {activeTargetPart === 'upperBody' && (
          <rect x="90" y="105" width="120" height="150" rx="16" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
        )}
        {activeTargetPart === 'lowerBody' && (
          <rect x="95" y="240" width="110" height="240" rx="16" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
        )}
        {activeTargetPart === 'fullBody' && (
          <rect x="85" y="105" width="130" height="380" rx="20" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
        )}
        {activeTargetPart === 'feet' && (
          <rect x="90" y="580" width="120" height="60" rx="12" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
        )}
        {activeTargetPart === 'handArm' && (
          <g>
            <rect x="210" y="260" width="70" height="150" rx="16" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
            <circle cx="248" cy="385" r="8" fill="#f43f5e" opacity="0.8" />
          </g>
        )}
        {activeTargetPart === 'wrist' && (
          <rect x="42" y="320" width="36" height="40" rx="8" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" />
        )}
        {activeTargetPart === 'neck' && (
          <rect x="125" y="85" width="50" height="50" rx="12" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" />
        )}
        {activeTargetPart === 'head' && (
          <rect x="120" y="20" width="60" height="65" rx="16" fill="url(#highlightGrad)" stroke="#f43f5e" strokeWidth="1.5" />
        )}

        {/* ======================================================= */}
        {/* 4. ANATOMICAL LANDMARK PINS (When Enabled)              */}
        {/* ======================================================= */}
        {showLandmarks && (
          <g id="landmarksPins" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5">
            <circle cx="150" cy="52" r="4" />
            <circle cx="150" cy="94" r="3.5" />
            <circle cx="108" cy="116" r="3.5" />
            <circle cx="192" cy="116" r="3.5" />
            <circle cx="150" cy="165" r="4" />
            <circle cx="150" cy="240" r="4" />
            <circle cx="150" cy="350" r="4" />
            <circle cx="118" cy="480" r="3.5" />
            <circle cx="182" cy="480" r="3.5" />
            <circle cx="112" cy="625" r="3.5" />
            <circle cx="188" cy="625" r="3.5" />
            <circle cx="50" cy="390" r="3.5" />
            <circle cx="250" cy="390" r="3.5" />
          </g>
        )}

      </svg>

      {/* Center Label Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full text-[10px] font-bold text-gray-300 flex items-center gap-1.5 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        <span>Neutral Human Form • Precision Anatomical Grid</span>
      </div>

    </div>
  );
};

export default NeutralHumanStructure;
