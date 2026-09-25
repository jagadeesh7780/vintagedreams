import React, { useState, useRef, useEffect } from 'react';
import { 
  FaSyncAlt, 
  FaPlay, 
  FaPause, 
  FaSearchPlus, 
  FaSearchMinus, 
  FaRedoAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaCube,
  FaArrowsAlt,
  FaInfoCircle
} from 'react-icons/fa';

/**
 * Reusable Product 360° Viewer Component
 * Supports:
 * - product.rotationFrames (array of multi-angle images)
 * - product.images (multi-image fallback)
 * - product.image (single image with interactive 3D perspective depth tilt)
 * - product.model3D (3D GLB/GLTF architecture support)
 */
const Product360Viewer = ({ product, className = '', onAngleChange }) => {
  const [angle, setAngle] = useState(0); // 0 to 360 degrees
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const containerRef = useRef(null);

  if (!product) return null;

  // Multi-frame resolution
  const availableImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'];

  const hasMultipleFrames = availableImages.length > 1 || (product.rotationFrames && product.rotationFrames.length > 1);
  const totalFrames = (product.rotationFrames && product.rotationFrames.length) || availableImages.length;

  // Map 0-360 angle to active frame index
  const activeFrameIndex = Math.floor(((angle % 360) / 360) * totalFrames) % totalFrames;
  const activeImage = (product.rotationFrames && product.rotationFrames[activeFrameIndex]) || availableImages[activeFrameIndex] || availableImages[0];

  // Auto spin timer
  useEffect(() => {
    let timer;
    if (isAutoSpin) {
      timer = setInterval(() => {
        setAngle((prev) => {
          const next = (prev + 3) % 360;
          if (onAngleChange) onAngleChange(next);
          return next;
        });
      }, 40);
    }
    return () => clearInterval(timer);
  }, [isAutoSpin, onAngleChange]);

  // Mouse & Touch Drag rotation handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartX.current = clientX;
    dragStartAngle.current = angle;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX.current;
    // 1px delta = 0.8 degrees of rotation
    const newAngle = (dragStartAngle.current + deltaX * 0.8) % 360;
    const normalized = newAngle < 0 ? 360 + newAngle : newAngle;
    setAngle(normalized);
    if (onAngleChange) onAngleChange(normalized);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const setPresetAngle = (targetAngle) => {
    setIsAutoSpin(false);
    setAngle(targetAngle);
    if (onAngleChange) onAngleChange(targetAngle);
  };

  // Human-readable angle designation
  const getAngleLabel = (deg) => {
    const norm = (deg % 360 + 360) % 360;
    if (norm >= 337.5 || norm < 22.5) return 'FRONT (0°)';
    if (norm >= 22.5 && norm < 67.5) return 'FRONT 45°';
    if (norm >= 67.5 && norm < 112.5) return 'RIGHT SIDE (90°)';
    if (norm >= 112.5 && norm < 157.5) return 'BACK 45°';
    if (norm >= 157.5 && norm < 202.5) return 'BACK (180°)';
    if (norm >= 202.5 && norm < 247.5) return 'BACK LEFT 45°';
    if (norm >= 247.5 && norm < 292.5) return 'LEFT SIDE (270°)';
    return 'FRONT LEFT 45°';
  };

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden select-none ${className}`}>
      
      {/* 1. Header with angle HUD and Auto-Spin */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-950 via-gray-900 to-rose-950 text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <FaCube className="text-rose-400" size={14} />
          <span className="font-serif-title text-xs font-bold uppercase tracking-wider">
            360° Interactive Showroom
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-black/60 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-rose-300 border border-white/10">
            {getAngleLabel(angle)}
          </span>
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isAutoSpin ? 'bg-rose-600 text-white shadow-md' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
            title={isAutoSpin ? 'Pause Orbit' : 'Auto 360° Orbit'}
          >
            {isAutoSpin ? <FaPause size={10} /> : <FaPlay size={10} />}
          </button>
        </div>
      </div>

      {/* 2. Interactive Stage Canvas */}
      <div
        ref={containerRef}
        className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 aspect-square sm:aspect-[4/3] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Subtle 3D Studio Pedestal Effect */}
        <div className="absolute bottom-6 w-3/4 h-12 bg-black/5 rounded-full filter blur-md pointer-events-none transform -rotate-x-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.03)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Product Image Stage */}
        <div
          className="relative transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) perspective(1000px) rotateY(${hasMultipleFrames ? 0 : angle}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <img
            src={activeImage}
            alt={product.name}
            className="max-h-[320px] sm:max-h-[380px] w-auto object-contain drop-shadow-2xl pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white flex items-center gap-1.5 pointer-events-none">
          <FaArrowsAlt size={10} className="text-rose-400" />
          <span>Drag to rotate 360°</span>
        </div>

        {/* Nudge Left/Right Overlay Buttons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPresetAngle((angle - 45 + 360) % 360);
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          title="Rotate Left 45°"
        >
          <FaChevronLeft size={12} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPresetAngle((angle + 45) % 360);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          title="Rotate Right 45°"
        >
          <FaChevronRight size={12} />
        </button>

        {/* Zoom & Reset Controls */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => Math.min(prev + 0.2, 2.0));
            }}
            className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-800 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            title="Zoom In"
          >
            <FaSearchPlus size={11} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => Math.max(prev - 0.2, 0.8));
            }}
            className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-800 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            title="Zoom Out"
          >
            <FaSearchMinus size={11} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(1);
              setAngle(0);
              setIsAutoSpin(false);
            }}
            className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-800 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            title="Reset View"
          >
            <FaRedoAlt size={10} />
          </button>
        </div>
      </div>

      {/* 3. Preset Angle Bar */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
          View Angles:
        </span>
        <div className="flex gap-1.5 flex-wrap flex-1 justify-center sm:justify-end">
          {[
            { label: 'Front', deg: 0 },
            { label: 'Front 45°', deg: 45 },
            { label: 'Side 90°', deg: 90 },
            { label: 'Back 45°', deg: 135 },
            { label: 'Back 180°', deg: 180 },
            { label: 'Side 270°', deg: 270 }
          ].map((preset) => {
            const isSelected = Math.abs(angle - preset.deg) < 22.5;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPresetAngle(preset.deg)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Product360Viewer;
