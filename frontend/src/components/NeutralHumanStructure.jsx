import React from 'react';
import { WIREFRAME_MANNEQUIN_SRC, BODY_PART_COORDINATES } from '../utils/tryOnUtils';

/**
 * NeutralHumanStructure - 3D Wireframe Mannequin Foundation
 * 
 * Uses the exact 3D Wireframe Mesh Mannequin structure as requested.
 * Does NOT show pre-dressed clothes or random male model photos.
 */
const NeutralHumanStructure = ({ 
  showLandmarks = false,
  activeTargetPart = null,
  className = '' 
}) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}>
      
      {/* 3D Wireframe Mesh Mannequin Base Image */}
      <img
        src={WIREFRAME_MANNEQUIN_SRC}
        alt="3D Wireframe Anatomical Mannequin"
        className="w-full h-full object-contain object-center drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] filter brightness-105"
      />

      {/* Target Zone Highlight Overlay */}
      {activeTargetPart && BODY_PART_COORDINATES[activeTargetPart] && (
        <div
          style={{
            position: 'absolute',
            top: BODY_PART_COORDINATES[activeTargetPart].top,
            left: BODY_PART_COORDINATES[activeTargetPart].left,
            width: BODY_PART_COORDINATES[activeTargetPart].width,
            height: BODY_PART_COORDINATES[activeTargetPart].height,
            transform: BODY_PART_COORDINATES[activeTargetPart].transform,
            zIndex: 10
          }}
          className="rounded-2xl border-2 border-dashed border-rose-500/80 bg-rose-500/15 pointer-events-none animate-pulse flex items-center justify-center"
        >
          <span className="text-[9px] font-extrabold text-white bg-rose-600/90 px-1.5 py-0.5 rounded shadow">
            Fitting: {activeTargetPart}
          </span>
        </div>
      )}

      {/* Anatomical Landmark Guides Overlay (When Landmark Toggle is ON) */}
      {showLandmarks && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-[6.5%] left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-500/90 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● Head / Face</span>
          </div>
          <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-500/90 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● Neck</span>
          </div>
          <div className="absolute top-[21%] left-[34%] -translate-x-1/2 flex items-center gap-1 bg-rose-500/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● L-Shoulder</span>
          </div>
          <div className="absolute top-[21%] left-[66%] -translate-x-1/2 flex items-center gap-1 bg-rose-500/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● R-Shoulder</span>
          </div>
          <div className="absolute top-[27%] left-1/2 -translate-x-1/2 flex items-center gap-1 bg-rose-500/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● Chest & Torso</span>
          </div>
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-500/90 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● Waist & Hips</span>
          </div>
          <div className="absolute top-[64%] left-1/2 -translate-x-1/2 flex items-center gap-1 bg-rose-500/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● Knees</span>
          </div>
          <div className="absolute top-[88%] left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-500/90 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
            <span>● Feet</span>
          </div>
        </div>
      )}

      {/* Center Label Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full text-[10px] font-bold text-gray-300 flex items-center gap-1.5 shadow-md z-30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        <span>3D Wireframe Mannequin Structure</span>
      </div>

    </div>
  );
};

export default NeutralHumanStructure;
