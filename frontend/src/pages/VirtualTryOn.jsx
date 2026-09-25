import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaCamera, 
  FaUpload, 
  FaTimes, 
  FaTrashAlt, 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaBolt, 
  FaSyncAlt, 
  FaSearch, 
  FaSlidersH, 
  FaMagic, 
  FaCube, 
  FaUser, 
  FaMale, 
  FaFemale, 
  FaUndoAlt, 
  FaCheck, 
  FaLock, 
  FaArrowsAlt, 
  FaRedoAlt,
  FaExpand,
  FaCompress,
  FaInfoCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaTshirt
} from 'react-icons/fa';
import { fallbackProducts } from '../data/fallbackProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Product360Viewer from '../components/Product360Viewer';
import RatingStars from '../components/RatingStars';
import toast from 'react-hot-toast';

// Studio Runway Mannequins & Models
const PRESET_MODELS = [
  {
    id: 'male-1',
    name: 'Men Studio Model',
    gender: 'men',
    icon: FaMale,
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    bodyType: 'Athletic Male (6\'1")'
  },
  {
    id: 'female-1',
    name: 'Women Haute Model',
    gender: 'women',
    icon: FaFemale,
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    bodyType: 'Slim Female (5\'9")'
  },
  {
    id: 'mannequin-1',
    name: '3D Runway Form',
    gender: 'all',
    icon: FaUser,
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    bodyType: 'Universal 3D Form'
  }
];

// Intelligent category placement coordinates (x%, y%, width%, height%)
const getInitialPlacement = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('pant') || cat.includes('cargo') || cat.includes('jeans')) {
    return { x: 50, y: 56, scale: 1.05, rotate: 0, opacity: 0.95 };
  }
  if (cat.includes('shoe') || cat.includes('sneaker') || cat.includes('footwear')) {
    return { x: 50, y: 82, scale: 0.85, rotate: 0, opacity: 0.95 };
  }
  if (cat.includes('watch')) {
    return { x: 28, y: 46, scale: 0.55, rotate: 10, opacity: 1 };
  }
  if (cat.includes('ring') || cat.includes('jewelry')) {
    return { x: 50, y: 32, scale: 0.45, rotate: 0, opacity: 1 };
  }
  // Default upper body (Shirts, Polos, Dresses, Sarees, Tops)
  return { x: 50, y: 24, scale: 1.15, rotate: 0, opacity: 0.95 };
};

const VirtualTryOn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Search & Filter state for Left Product Panel
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  // Active Equipped Product
  const initialProductId = searchParams.get('productId');
  const initialProduct = initialProductId 
    ? fallbackProducts.find(p => p._id === initialProductId || p.id === initialProductId) || fallbackProducts[0]
    : fallbackProducts[0];

  const [activeProduct, setActiveProduct] = useState(initialProduct);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);

  // User Photo / Avatar state
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [activePreset, setActivePreset] = useState(PRESET_MODELS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Canvas View State (Pan & Zoom of background photo)
  const [canvasZoom, setCanvasZoom] = useState(1.0);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });

  // Product Overlay Transform State
  const [overlayPlacement, setOverlayPlacement] = useState(() => getInitialPlacement(initialProduct?.category));
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const [show360Modal, setShow360Modal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 50, initialY: 24 });

  // Sync when product changes
  useEffect(() => {
    if (activeProduct) {
      setOverlayPlacement(getInitialPlacement(activeProduct.category));
      if (activeProduct.sizes && activeProduct.sizes.length > 0) {
        setSelectedSize(activeProduct.sizes[0]);
      }
      if (activeProduct.colors && activeProduct.colors.length > 0) {
        setSelectedColor(activeProduct.colors[0]);
      }
    }
  }, [activeProduct]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Filtered Products for Left Panel
  const filteredProducts = fallbackProducts.filter(p => {
    const matchesKeyword = !searchKeyword || 
      p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.category.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || p.gender === selectedGender;
    return matchesKeyword && matchesCategory && matchesGender;
  });

  // Unique categories list
  const categoriesList = [
    { id: 'all', label: 'All Products' },
    { id: 'shirts', label: 'Shirts & Polos' },
    { id: 'pants', label: 'Pants & Cargos' },
    { id: 'shoes', label: 'Shoes & Sneakers' },
    { id: 'watches', label: 'Luxury Watches' },
    { id: 'rings', label: '925 Silver Rings' },
    { id: 'women-dresses', label: 'Dresses & Gowns' },
    { id: 'women-sarees', label: 'Silk Sarees' },
    { id: 'women-tops', label: 'Tops & Kurtis' }
  ];

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1080 }, height: { ideal: 1440 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Camera access was not allowed. You can upload a photo instead.');
      setIsCameraActive(false);
      toast.error('Camera access denied. Please upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && captureCanvasRef.current) {
      const video = videoRef.current;
      const canvas = captureCanvasRef.current;
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setUserPhotoUrl(dataUrl);
      stopCamera();
      toast.success('Live photo captured for virtual try-on!', { icon: '📸' });
    }
  };

  // Image Upload Validation (< 10MB, JPG/PNG/WEBP)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be below 10 MB.');
      return;
    }

    // Check format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserPhotoUrl(event.target.result);
      stopCamera();
      toast.success('Photo loaded! Drag products to try them on.', { icon: '✨' });
    };
    reader.readAsDataURL(file);
  };

  // HTML5 Drag & Drop from Left Panel to Canvas
  const handleDragStartProduct = (e, product) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    e.dataTransfer.setData('text/plain', product._id || product.id);
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(true);
  };

  const handleCanvasDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(false);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(false);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const droppedProduct = JSON.parse(rawData);
        setActiveProduct(droppedProduct);
        setOverlayPlacement(getInitialPlacement(droppedProduct.category));
        toast.success(`Equipped ${droppedProduct.name} onto your look!`, { icon: '✨' });
      }
    } catch (err) {
      toast.error('Unable to drop this item.');
    }
  };

  // Interactive Moving of the Product Overlay
  const handleOverlayMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingOverlay(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      initialX: overlayPlacement.x,
      initialY: overlayPlacement.y
    };
  };

  const handleOverlayMouseMove = (e) => {
    if (!isDraggingOverlay || !canvasRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const bounds = canvasRef.current.getBoundingClientRect();
    const deltaXPercent = ((clientX - dragStartRef.current.mouseX) / bounds.width) * 100;
    const deltaYPercent = ((clientY - dragStartRef.current.mouseY) / bounds.height) * 100;

    const newX = Math.min(Math.max(dragStartRef.current.initialX + deltaXPercent, 10), 90);
    const newY = Math.min(Math.max(dragStartRef.current.initialY + deltaYPercent, 10), 90);

    setOverlayPlacement(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleOverlayMouseUp = () => {
    setIsDraggingOverlay(false);
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!activeProduct) {
      toast.error('Please select a product first.');
      return;
    }
    setAddingToCart(true);
    addToCart(activeProduct, quantity, selectedSize, selectedColor);
    setTimeout(() => {
      setAddingToCart(false);
      toast((t) => (
        <div className="flex items-center justify-between gap-4">
          <span>Added <strong>{activeProduct.name}</strong> ({selectedSize}) to cart!</span>
          <Link
            to="/cart"
            onClick={() => toast.dismiss(t.id)}
            className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow"
          >
            View Cart
          </Link>
        </div>
      ), { duration: 4000, icon: '🛒' });
    }, 400);
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!activeProduct) {
      toast.error('Please select a product to purchase.');
      return;
    }
    const pId = activeProduct._id || activeProduct.id;
    try {
      sessionStorage.setItem('vintage_active_buynow', JSON.stringify(activeProduct));
    } catch (e) {}
    navigate(`/buy-now?productId=${pId}&size=${selectedSize}&color=${selectedColor}&quantity=${quantity}`);
  };

  // Wishlist
  const isWishlisted = activeProduct ? isInWishlist(activeProduct._id || activeProduct.id) : false;
  const handleToggleWishlist = () => {
    if (activeProduct) {
      toggleWishlist(activeProduct);
    }
  };

  // Active Background Image
  const activeBackground = userPhotoUrl || activePreset.img;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 pb-16">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-xs"
              title="Return to Catalog"
            >
              <FaArrowLeft size={13} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600">
                  Virtual Fashion Studio
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold font-serif-title text-gray-900 leading-tight">
                Virtual Try-On & 360° Showroom
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShow360Modal(true)}
              className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <FaCube className="text-rose-400" />
              <span>360° View</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <FaShoppingCart />
              <span>{addingToCart ? 'Added ✓' : 'Add to Cart'}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-900/20 transition-all cursor-pointer active:scale-95"
            >
              <FaBolt />
              <span>Buy Now</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. THREE-COLUMN SHOWROOM WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: PRODUCT SELECTOR (Col-span-3) */}
          {/* ========================================================= */}
          <section className="lg:col-span-3 bg-white rounded-3xl border border-gray-200/90 p-4 sm:p-5 shadow-sm space-y-4 max-h-[82vh] overflow-y-auto slim-scrollbar flex flex-col">
            
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 font-serif-title">
                <FaTshirt className="text-rose-600" />
                <span>Wardrobe Catalog</span>
              </span>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                {filteredProducts.length} Items
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto slim-scrollbar pb-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Drag instruction notice */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[10px] text-amber-900 flex items-start gap-2">
              <FaMagic className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Drag & Drop:</strong> Drag any garment from below onto the center canvas to try it on!
              </span>
            </div>

            {/* Product Card List */}
            <div className="space-y-2.5 overflow-y-auto slim-scrollbar flex-1 pr-1">
              {filteredProducts.map((p) => {
                const isCurrent = activeProduct?._id === p._id || activeProduct?.id === p.id;
                return (
                  <div
                    key={p._id || p.id || p.name}
                    draggable={true}
                    onDragStart={(e) => handleDragStartProduct(e, p)}
                    onClick={() => setActiveProduct(p)}
                    className={`group p-2.5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing flex items-center gap-3 ${
                      isCurrent
                        ? 'border-rose-600 bg-rose-50/60 shadow-sm ring-2 ring-rose-600/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <img
                      src={p.images?.[0] || p.image}
                      alt={p.name}
                      className="w-12 h-14 object-cover rounded-xl border border-gray-200 bg-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-gray-900">₹{p.price}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through">₹{p.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProduct(p);
                        toast.success(`Equipped ${p.name}!`, { icon: '👕' });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                        isCurrent
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 group-hover:bg-rose-600 group-hover:text-white text-gray-700'
                      }`}
                    >
                      {isCurrent ? 'Equipped ✓' : 'Try On'}
                    </button>
                  </div>
                );
              })}
            </div>

          </section>

          {/* ========================================================= */}
          {/* CENTER PANEL: MAIN TRY-ON CANVAS (Col-span-5) */}
          {/* ========================================================= */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Canvas Container */}
            <div
              ref={canvasRef}
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
              onDrop={handleCanvasDrop}
              onMouseMove={handleOverlayMouseMove}
              onMouseUp={handleOverlayMouseUp}
              onTouchMove={handleOverlayMouseMove}
              onTouchEnd={handleOverlayMouseUp}
              className={`relative bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200 rounded-3xl border border-gray-200/90 shadow-xl aspect-[3/4] overflow-hidden flex items-center justify-center select-none ${
                isDragOverCanvas ? 'ring-4 ring-rose-500/30 border-rose-500' : ''
              }`}
            >
              {/* Visual Drop Target Overlay */}
              {isDragOverCanvas && (
                <div className="absolute inset-0 z-40 bg-rose-600/20 backdrop-blur-xs border-4 border-dashed border-rose-600 flex flex-col items-center justify-center gap-2 text-rose-950 font-extrabold text-sm animate-pulse">
                  <FaTshirt size={40} className="text-rose-600 animate-bounce" />
                  <span>Drop Garment To Equip On Model!</span>
                </div>
              )}

              {/* CAMERA LIVE PREVIEW */}
              {isCameraActive ? (
                <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  <canvas ref={captureCanvasRef} className="hidden" />
                  <div className="absolute bottom-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                    >
                      <FaCamera size={14} />
                      <span>Capture Snapshot</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg cursor-pointer"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* BASE PERSON / AVATAR LAYER */
                <div 
                  className="relative w-full h-full flex items-center justify-center overflow-hidden"
                  style={{
                    transform: `scale(${canvasZoom}) translate(${canvasPan.x}px, ${canvasPan.y}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <img
                    src={activeBackground}
                    alt="User Try-on Model"
                    className="w-full h-full object-cover object-top pointer-events-none filter contrast-105 brightness-95"
                    draggable={false}
                  />

                  {/* MOVABLE, RESIZABLE, ROTATABLE PRODUCT OVERLAY */}
                  {activeProduct && (
                    <div
                      onMouseDown={handleOverlayMouseDown}
                      onTouchStart={handleOverlayMouseDown}
                      style={{
                        position: 'absolute',
                        left: `${overlayPlacement.x}%`,
                        top: `${overlayPlacement.y}%`,
                        transform: `translate(-50%, -50%) scale(${overlayPlacement.scale}) rotate(${overlayPlacement.rotate}deg)`,
                        opacity: overlayPlacement.opacity,
                        cursor: isDraggingOverlay ? 'grabbing' : 'grab',
                        zIndex: 20
                      }}
                      className="group/overlay flex items-center justify-center"
                    >
                      {/* Active Bounding Box Highlight on Hover/Drag */}
                      <div className="relative p-2 border-2 border-dashed border-rose-500/70 hover:border-rose-600 rounded-2xl bg-rose-500/5 group-hover/overlay:bg-rose-500/10 transition-colors shadow-2xl">
                        <img
                          src={activeProduct.images?.[0] || activeProduct.image}
                          alt={activeProduct.name}
                          className="w-48 sm:w-56 h-auto object-contain mix-blend-multiply filter drop-shadow-2xl pointer-events-none"
                          draggable={false}
                        />

                        {/* Corner Drag Handle Badges */}
                        <div className="absolute -top-3 -right-3 bg-rose-600 text-white rounded-full p-1.5 shadow-lg flex items-center justify-center text-[10px]">
                          <FaArrowsAlt size={9} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Canvas Overlay Toolbar (Zoom, Replace, Reset) */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200/90 shadow-lg">
                <button
                  type="button"
                  onClick={() => setCanvasZoom(prev => Math.min(prev + 0.15, 1.8))}
                  className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-700 text-xs cursor-pointer"
                  title="Zoom In Model"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasZoom(prev => Math.max(prev - 0.15, 0.7))}
                  className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-700 text-xs cursor-pointer"
                  title="Zoom Out Model"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasZoom(1.0);
                    setCanvasPan({ x: 0, y: 0 });
                    if (activeProduct) setOverlayPlacement(getInitialPlacement(activeProduct.category));
                  }}
                  className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-700 text-xs cursor-pointer"
                  title="Reset Alignment"
                >
                  <FaUndoAlt size={10} />
                </button>
              </div>

              {/* Replace / Remove Photo Button */}
              {userPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setUserPhotoUrl(null)}
                  className="absolute top-4 right-4 z-20 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-1.5 cursor-pointer"
                  title="Remove Custom Photo & Use Preset"
                >
                  <FaTimes size={10} />
                  <span>Reset Model</span>
                </button>
              )}

              {/* Floating Instructions Banner */}
              <div className="absolute bottom-3 inset-x-4 z-20 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-2xl text-white text-[10px] flex items-center justify-between gap-2 shadow-lg">
                <span className="flex items-center gap-1.5 text-gray-200 truncate">
                  <FaArrowsAlt className="text-rose-400" />
                  <span>Drag garment to position anywhere on your body</span>
                </span>
                <span className="text-rose-300 font-mono font-bold shrink-0">
                  Rot: {Math.round(overlayPlacement.rotate)}°
                </span>
              </div>
            </div>

            {/* Photo Source Switcher Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <FaCamera className="text-rose-600" />
                  <span>Photo Source:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FaCamera size={11} />
                    <span>Live Cam</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FaUpload size={11} />
                    <span>Upload Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Preset Model Avatars */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                  Runway Models:
                </span>
                <div className="flex gap-1.5 overflow-x-auto slim-scrollbar">
                  {PRESET_MODELS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setUserPhotoUrl(null);
                        setActivePreset(preset);
                      }}
                      className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        !userPhotoUrl && activePreset.id === preset.id
                          ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <preset.icon size={10} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Message */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <FaLock size={9} className="text-emerald-600" />
                <span>Your photo is processed locally in your browser and is not uploaded to external servers.</span>
              </div>
            </div>

            {/* Garment Position & Tuning Sliders */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <FaSlidersH className="text-rose-600" />
                  <span>Fine-Tune Garment Fitting</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOverlayPlacement(getInitialPlacement(activeProduct?.category))}
                  className="text-[10px] text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                >
                  Reset Placement
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                    <span>Size Scale</span>
                    <span>{Math.round(overlayPlacement.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.2"
                    step="0.05"
                    value={overlayPlacement.scale}
                    onChange={(e) => setOverlayPlacement(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* Rotation Slider */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                    <span>Rotation</span>
                    <span>{Math.round(overlayPlacement.rotate)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="2"
                    value={overlayPlacement.rotate}
                    onChange={(e) => setOverlayPlacement(prev => ({ ...prev, rotate: parseInt(e.target.value) }))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* Opacity Slider */}
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                    <span>Fabric Opacity</span>
                    <span>{Math.round(overlayPlacement.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={overlayPlacement.opacity}
                    onChange={(e) => setOverlayPlacement(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </section>

          {/* ========================================================= */}
          {/* RIGHT PANEL: PRODUCT DETAILS & 360 VIEWER (Col-span-4) */}
          {/* ========================================================= */}
          <section className="lg:col-span-4 space-y-4">
            
            {/* Main Product Card */}
            {activeProduct ? (
              <div className="bg-white rounded-3xl border border-gray-200/90 p-5 shadow-sm space-y-4">
                
                {/* Brand & Category */}
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>{activeProduct.brand || 'Vintage Dreams'}</span>
                  <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    {activeProduct.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold font-serif-title text-gray-900 leading-snug">
                  {activeProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <RatingStars rating={activeProduct.rating || 4.8} count={activeProduct.numReviews || 38} size={12} />
                  <span className="text-xs text-gray-500">({activeProduct.numReviews || 38} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 pb-3 border-b border-gray-100">
                  <span className="text-2xl font-black text-gray-900">₹{activeProduct.price}</span>
                  {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                    <>
                      <span className="text-xs text-gray-400 line-through">₹{activeProduct.originalPrice}</span>
                      <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                        {Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Size Selector */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-900 mb-2">
                    <span>Select Size: <strong className="text-rose-600">{selectedSize}</strong></span>
                    <span className="text-[10px] text-gray-400 font-normal">True to fit</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeProduct.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-900 mb-2">
                    <span>Select Color: <strong className="text-gray-900">{selectedColor}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(activeProduct.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedColor === color
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.min(prev + 1, 10))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* "How does it look?" Section with Actions */}
                <div className="pt-3 border-t border-gray-100 space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block text-center">
                    Satisfaction & Purchase
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isWishlisted
                          ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {isWishlisted ? <FaHeart className="text-rose-600 animate-pulse" /> : <FaRegHeart />}
                      <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShow360Modal(true)}
                      className="w-full py-2.5 px-3 rounded-xl border border-gray-900 bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <FaCube className="text-rose-400" />
                      <span>360° Studio</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full bg-amber-400 hover:bg-amber-500 active:scale-98 text-gray-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <FaShoppingCart size={13} />
                    <span>{addingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <FaBolt size={13} />
                    <span>Instant Buy Now</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3">
                <FaTshirt size={32} className="text-gray-300 mx-auto" />
                <h3 className="font-serif-title text-base font-bold text-gray-900">
                  Pick a garment from the left catalog
                </h3>
                <p className="text-xs text-gray-500">
                  Select any shirt, dress, pant, watch, or ring to inspect its 360° view and try it on.
                </p>
              </div>
            )}

            {/* Embedded 360 Viewer Card */}
            {activeProduct && (
              <Product360Viewer product={activeProduct} className="hidden sm:flex" />
            )}

          </section>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 360° FULL MODAL VIEW */}
      {/* ========================================================= */}
      {show360Modal && activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCube className="text-rose-400" />
                <h3 className="font-serif-title text-sm font-bold truncate">{activeProduct.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShow360Modal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaTimes size={13} />
              </button>
            </div>
            <div className="p-4">
              <Product360Viewer product={activeProduct} />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">₹{activeProduct.price}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VirtualTryOn;
