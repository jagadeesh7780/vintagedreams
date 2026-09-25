import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCamera, 
  FaUpload, 
  FaSyncAlt, 
  FaPlay, 
  FaPause, 
  FaShoppingCart, 
  FaBolt, 
  FaTimes, 
  FaTrashAlt, 
  FaCheck, 
  FaSlidersH,
  FaRedoAlt,
  FaUser,
  FaFemale,
  FaMale,
  FaMagic,
  FaArrowsAltH,
  FaTshirt
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// High quality model presets (Front & Back)
const MODEL_PRESETS = [
  {
    id: 'male-1',
    name: 'Men Studio Model',
    gender: 'men',
    icon: FaMale,
    frontImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    backImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    bodyType: 'Athletic Male'
  },
  {
    id: 'female-1',
    name: 'Women Haute Model',
    gender: 'women',
    icon: FaFemale,
    frontImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    backImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    bodyType: 'Slim Female'
  },
  {
    id: 'mannequin-1',
    name: '3D Runway Mannequin',
    gender: 'all',
    icon: FaUser,
    frontImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    backImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    bodyType: 'Universal 3D Form'
  }
];

const VirtualMirror360 = ({ 
  isOpen = true, 
  onClose, 
  onProductEquip, 
  activeEquippedProduct = null 
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Mode: 'preset' | 'camera' | 'upload'
  const [avatarMode, setAvatarMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState(MODEL_PRESETS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  
  // Camera stream state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 360 Rotation State (0 to 360 degrees)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  // Equipped Garments State (Upper, Lower, Accessory)
  const [equippedUpper, setEquippedUpper] = useState(activeEquippedProduct || null);
  const [equippedLower, setEquippedLower] = useState(null);
  const [equippedAccessory, setEquippedAccessory] = useState(null);
  
  // Selected variant for the active garment
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [isDragOver, setIsDragOver] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Sync when parent changes activeEquippedProduct
  useEffect(() => {
    if (activeEquippedProduct) {
      equipItem(activeEquippedProduct);
    }
  }, [activeEquippedProduct]);

  // Handle 360 Auto-spin
  useEffect(() => {
    let spinInterval;
    if (isAutoSpinning) {
      spinInterval = setInterval(() => {
        setRotationAngle((prev) => (prev + 3) % 360);
      }, 50);
    }
    return () => clearInterval(spinInterval);
  }, [isAutoSpinning]);

  // Clean up camera stream
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const equipItem = (item) => {
    if (!item) return;
    const cat = (item.category || '').toLowerCase();
    
    if (cat.includes('pant') || cat.includes('cargo') || cat.includes('jeans') || cat.includes('bottom')) {
      setEquippedLower(item);
      toast.success(`Equipped ${item.name} to Lower Body`, { icon: '👖' });
    } else if (cat.includes('watch') || cat.includes('ring') || cat.includes('jewelry') || cat.includes('shoe')) {
      setEquippedAccessory(item);
      toast.success(`Equipped ${item.name}`, { icon: '✨' });
    } else {
      setEquippedUpper(item);
      toast.success(`Equipped ${item.name} on Model!`, { icon: '👕' });
    }

    if (item.sizes && item.sizes.length > 0) {
      setSelectedSize(item.sizes[0]);
    }
    if (item.colors && item.colors.length > 0) {
      setSelectedColor(item.colors[0]);
    }
  };

  // Drag and drop listeners on Mirror box
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const droppedProduct = JSON.parse(dataStr);
        equipItem(droppedProduct);
        if (onProductEquip) onProductEquip(droppedProduct);
      }
    } catch (err) {
      toast.error('Unable to drop this item.');
    }
  };

  // Camera handling
  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    setAvatarMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 960 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Camera access denied or unavailable. Please upload a photo or use a 3D model.');
      setCameraActive(false);
      setAvatarMode('preset');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCustomPhotoUrl(dataUrl);
      stopCamera();
      setAvatarMode('upload');
      toast.success('Live photo captured successfully!', { icon: '📸' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoUrl(event.target.result);
        setAvatarMode('upload');
        stopCamera();
        toast.success('Photo uploaded for 360° try-on!', { icon: '✨' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag-to-rotate handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartAngle.current = rotationAngle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = currentX - dragStartX.current;
    const newAngle = (dragStartAngle.current + deltaX * 0.8) % 360;
    setRotationAngle(newAngle < 0 ? 360 + newAngle : newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Determine active view (Front vs Back based on angle)
  const isBackView = rotationAngle > 90 && rotationAngle < 270;
  const currentViewTitle = 
    (rotationAngle >= 315 || rotationAngle < 45) ? 'Front 0°' :
    (rotationAngle >= 45 && rotationAngle < 135) ? 'Right Side 90°' :
    (rotationAngle >= 135 && rotationAngle < 225) ? 'Back View 180°' : 'Left Side 270°';

  // Active primary garment to purchase
  const activeGarment = equippedUpper || equippedLower || equippedAccessory;

  const handleAddToCart = () => {
    if (!activeGarment) {
      toast.error('Please equip a garment first by dragging or clicking Try On!');
      return;
    }
    setAddingToCart(true);
    addToCart(activeGarment, 1, selectedSize, selectedColor);
    setTimeout(() => {
      setAddingToCart(false);
    }, 600);
  };

  const handleBuyNow = () => {
    if (!activeGarment) {
      toast.error('Please equip a garment first to buy!');
      return;
    }
    const pId = activeGarment._id || activeGarment.id;
    try {
      sessionStorage.setItem('vintage_active_buynow', JSON.stringify(activeGarment));
    } catch (e) {}
    navigate(`/buy-now?productId=${pId}&size=${selectedSize}&color=${selectedColor}`);
  };

  const clearAllGarments = () => {
    setEquippedUpper(null);
    setEquippedLower(null);
    setEquippedAccessory(null);
    toast('Fitting room cleared', { icon: '🧹' });
  };

  return (
    <aside
      className={`bg-white rounded-3xl border border-gray-200/90 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isDragOver ? 'ring-4 ring-rose-500/30 border-rose-500 scale-[1.01]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 1. TOP HEADER & INPUT SOURCES */}
      <div className="p-4 bg-gradient-to-r from-gray-950 via-gray-900 to-rose-950 text-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 font-serif-title">
              <FaMagic className="text-rose-400" />
              <span>360° AI Virtual Try-On Room</span>
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        {/* Source Switcher: Live Camera | Upload Photo | Preset Avatars */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 text-[11px] font-semibold">
          <button
            type="button"
            onClick={startCamera}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              avatarMode === 'camera'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaCamera size={11} />
            <span>Live Cam</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              avatarMode === 'upload'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaUpload size={11} />
            <span>Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setAvatarMode('preset');
            }}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              avatarMode === 'preset'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaUser size={11} />
            <span>Models</span>
          </button>
        </div>

        {/* Preset Selector Dropdown (Visible in Preset Mode) */}
        {avatarMode === 'preset' && (
          <div className="flex gap-1.5 overflow-x-auto slim-scrollbar py-0.5">
            {MODEL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'border-rose-400 bg-rose-950/60 text-rose-200'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                }`}
              >
                <preset.icon size={10} />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. MIDDLE 360° INTERACTIVE STAGE */}
      <div 
        className="relative bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200 aspect-[3/4] overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing border-b border-gray-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Drag Over Visual Indicator */}
        {isDragOver && (
          <div className="absolute inset-0 z-40 bg-rose-600/20 backdrop-blur-xs border-4 border-dashed border-rose-600 flex flex-col items-center justify-center gap-2 text-rose-900 font-extrabold text-sm animate-pulse">
            <FaTshirt size={36} className="text-rose-600 animate-bounce" />
            <span>Release To Equip On Model!</span>
          </div>
        )}

        {/* CAMERA MODE LIVE VIDEO */}
        {avatarMode === 'camera' && cameraActive && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
            <canvas ref={canvasRef} className="hidden" />
            <button
              type="button"
              onClick={captureSnapshot}
              className="absolute bottom-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-full shadow-2xl flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              <FaCamera size={14} />
              <span>Capture Snapshot</span>
            </button>
          </div>
        )}

        {/* 3D AVATAR & GARMENT PERSPECTIVE STAGE */}
        {avatarMode !== 'camera' && (
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{
              perspective: '1200px'
            }}
          >
            {/* Person Model Canvas / Image */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden transition-transform ease-out duration-100"
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Base Avatar */}
              <img
                src={
                  avatarMode === 'upload' && customPhotoUrl
                    ? customPhotoUrl
                    : isBackView && selectedPreset.backImg
                    ? selectedPreset.backImg
                    : selectedPreset.frontImg
                }
                alt="Virtual Try On Model"
                className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
                draggable={false}
              />

              {/* OVERLAY GARMENTS (Equipped Tops / Shirts / Dresses) */}
              {equippedUpper && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300"
                  style={{
                    opacity: isBackView ? 0.85 : 0.95,
                    filter: isBackView ? 'contrast(1.1) brightness(0.9)' : 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))'
                  }}
                >
                  <div className="relative w-[78%] max-w-[280px] top-[12%] transform hover:scale-105 transition-transform">
                    <img
                      src={equippedUpper.images?.[0] || equippedUpper.image}
                      alt={equippedUpper.name}
                      className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl"
                      draggable={false}
                    />
                    {isBackView && (
                      <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Back View
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* OVERLAY GARMENTS (Equipped Lower / Pants) */}
              {equippedLower && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    opacity: 0.92,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                  }}
                >
                  <div className="relative w-[70%] max-w-[240px] top-[46%]">
                    <img
                      src={equippedLower.images?.[0] || equippedLower.image}
                      alt={equippedLower.name}
                      className="w-full h-auto object-contain mix-blend-multiply"
                      draggable={false}
                    />
                  </div>
                </div>
              )}

              {/* OVERLAY ACCESSORIES (Watches / Rings / Shoes) */}
              {equippedAccessory && (
                <div className="absolute bottom-6 right-6 w-20 h-20 bg-white/90 backdrop-blur-md rounded-2xl p-2 border border-gray-200 shadow-xl pointer-events-none flex flex-col items-center justify-center text-center">
                  <img
                    src={equippedAccessory.images?.[0] || equippedAccessory.image}
                    alt={equippedAccessory.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-[8px] font-extrabold text-gray-800 truncate max-w-full">
                    {equippedAccessory.name}
                  </span>
                </div>
              )}
            </div>

            {/* Empty fitting room prompt if nothing is equipped */}
            {!equippedUpper && !equippedLower && !equippedAccessory && (
              <div className="absolute inset-x-4 top-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-gray-200 shadow-lg text-center space-y-1 z-20">
                <p className="text-[11px] font-bold text-gray-900 flex items-center justify-center gap-1.5">
                  <FaMagic className="text-rose-600" />
                  <span>Drag & Drop Any Product Here!</span>
                </p>
                <p className="text-[10px] text-gray-500">
                  Or click <strong className="text-rose-600">"✨ Try On"</strong> on any product card on the left.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 360° Angle HUD Overlay & Controls */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
          <div className="bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
            <FaArrowsAltH className="text-rose-400" />
            <span>{currentViewTitle}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoSpinning(!isAutoSpinning)}
            title={isAutoSpinning ? 'Pause Auto-Spin' : 'Start 360° Orbit'}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer ${
              isAutoSpinning
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white/90 text-gray-800 hover:bg-white'
            }`}
          >
            {isAutoSpinning ? <FaPause size={10} /> : <FaPlay size={10} />}
          </button>
        </div>

        {/* Quick Angle Preset Pills at bottom of stage */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between gap-1 bg-black/60 backdrop-blur-md p-1.5 rounded-xl text-white">
          <div className="flex gap-1">
            {[
              { label: 'Front', deg: 0 },
              { label: 'Side', deg: 90 },
              { label: 'Back', deg: 180 },
              { label: '360°', deg: 270 }
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setIsAutoSpinning(false);
                  setRotationAngle(p.deg);
                }}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  Math.abs(rotationAngle - p.deg) < 30
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 360 Drag rotation hint */}
          <span className="text-[9px] text-gray-300 font-medium hidden sm:inline">
            Drag ↔ to rotate
          </span>

          {(equippedUpper || equippedLower || equippedAccessory) && (
            <button
              type="button"
              onClick={clearAllGarments}
              title="Clear outfit"
              className="text-gray-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
            >
              <FaTrashAlt size={11} />
            </button>
          )}
        </div>
      </div>

      {/* 3. BOTTOM CONTROLS & CHECKOUT ACTIONS */}
      <div className="p-4 bg-white space-y-3.5">
        {activeGarment ? (
          <>
            {/* Active Garment Info */}
            <div className="flex items-center gap-3">
              <img
                src={activeGarment.images?.[0] || activeGarment.image}
                alt={activeGarment.name}
                className="w-12 h-14 object-cover rounded-xl border border-gray-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                  Active Try-On Outfit
                </span>
                <h4 className="text-xs font-bold text-gray-900 truncate">
                  {activeGarment.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-sm font-extrabold text-gray-900">
                    ₹{activeGarment.price}
                  </span>
                  {activeGarment.originalPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{activeGarment.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Size and Color Selector for worn garment */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
              {/* Size */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Size: <span className="text-gray-900 font-extrabold">{selectedSize}</span>
                </label>
                <div className="flex gap-1 overflow-x-auto slim-scrollbar">
                  {(activeGarment.sizes || ['S', 'M', 'L', 'XL']).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Color: <span className="text-gray-900 font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex gap-1 overflow-x-auto slim-scrollbar">
                  {(activeGarment.colors || ['Black', 'White', 'Navy']).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: Add to Cart & Buy Now */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {addingToCart ? <FaCheck size={11} /> : <FaShoppingCart size={12} />}
                <span>{addingToCart ? 'Added ✓' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer"
              >
                <FaBolt size={12} />
                <span>Buy Now</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-2 space-y-2">
            <p className="text-xs text-gray-500 leading-relaxed">
              Drag any product from the catalog on the left and drop it here to preview in 360°!
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <FaTshirt className="text-rose-400" />
              <span>Shirts • Dresses • Pants • Accessories</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default VirtualMirror360;
