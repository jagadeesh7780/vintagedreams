import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaCamera, 
  FaUpload, 
  FaTimes, 
  FaTrashAlt, 
  FaShoppingCart, 
  FaBolt, 
  FaSyncAlt, 
  FaSearch, 
  FaMagic, 
  FaUserAlt, 
  FaUndoAlt, 
  FaCheck, 
  FaPlay, 
  FaPause,
  FaSlidersH, 
  FaTshirt,
  FaLayerGroup,
  FaPlus
} from 'react-icons/fa';
import { fallbackProducts } from '../data/fallbackProducts';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/RatingStars';
import NeutralHumanStructure from '../components/NeutralHumanStructure';
import toast from 'react-hot-toast';
import { 
  CATEGORY_BODY_PART_MAP, 
  LAYER_PRIORITIES, 
  BODY_PART_COORDINATES, 
  resolveBodyPart, 
  compressImage, 
  getComplementaryRecommendations 
} from '../utils/tryOnUtils';

const VirtualTryOn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Initial Product Resolution
  const initialProductId = searchParams.get('productId');
  const initialProduct = initialProductId 
    ? fallbackProducts.find(p => p._id === initialProductId || p.id === initialProductId) || fallbackProducts[0]
    : fallbackProducts[0];

  const [activeProduct, setActiveProduct] = useState(() => {
    const part = resolveBodyPart(initialProduct.category, initialProduct.name);
    return {
      ...initialProduct,
      targetBodyPart: part,
      layerPriority: LAYER_PRIORITIES[part] || 3,
      selectedSize: initialProduct.sizes?.[0] || 'M',
      selectedColor: initialProduct.colors?.[0] || 'Standard'
    };
  });

  const [selectedProducts, setSelectedProducts] = useState(() => [activeProduct]);
  const [userImage, setUserImage] = useState(null);
  const [imageSource, setImageSource] = useState('neutral'); // 'neutral' | 'upload' | 'camera'
  const [silhouetteType, setSilhouetteType] = useState('neutral');
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhotoTemp, setCapturedPhotoTemp] = useState(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  // AI Fitting state
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiStep, setAiStep] = useState('');
  const [aiResultImage, setAiResultImage] = useState(null);

  // Sync when productId param changes
  useEffect(() => {
    if (initialProductId) {
      const p = fallbackProducts.find(item => item._id === initialProductId || item.id === initialProductId);
      if (p) {
        const part = resolveBodyPart(p.category, p.name);
        const equipped = {
          ...p,
          targetBodyPart: part,
          layerPriority: LAYER_PRIORITIES[part] || 3,
          selectedSize: p.sizes?.[0] || 'M',
          selectedColor: p.colors?.[0] || 'Standard'
        };
        setActiveProduct(equipped);
        setSelectedProducts([equipped]);
      }
    }
  }, [initialProductId]);

  // Clean camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Filter products for left sidebar
  const filteredCatalog = fallbackProducts.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesKeyword = !searchKeyword || p.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCat && matchesKeyword;
  });

  // Recommendations
  const recommendations = getComplementaryRecommendations(selectedProducts, fallbackProducts, 6);

  const totalOutfitPrice = selectedProducts.reduce((sum, item) => sum + (item.price || 0), 0);

  // Camera handlers
  const handleStartCamera = async () => {
    setCapturedPhotoTemp(null);
    setCameraActive(true);
    setImageSource('camera');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 1920 }, facingMode: 'user' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      toast.error('Camera access denied or unavailable.');
      setCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhotoTemp(canvas.toDataURL('image/jpeg', 0.9));
  };

  const handleUseCapturedPhoto = () => {
    if (capturedPhotoTemp) {
      setUserImage(capturedPhotoTemp);
      setImageSource('camera');
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      setCameraActive(false);
      toast.success('Live photo set as Try-On base!');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 1200, 1600, 0.88);
      setUserImage(compressed.dataUrl);
      setImageSource('upload');
      setCameraActive(false);
      toast.success('Photo uploaded & set as Try-On base!');
    } catch (err) {
      toast.error('Failed to process image.');
    }
  };

  const handleEquipProduct = (item) => {
    const pId = item._id || item.id;
    if (selectedProducts.some(p => (p._id || p.id) === pId)) {
      toast.error(`${item.name} is already equipped!`);
      return;
    }
    const part = resolveBodyPart(item.category, item.name);
    const newEquipped = {
      ...item,
      _id: pId,
      targetBodyPart: part,
      layerPriority: LAYER_PRIORITIES[part] || 3,
      selectedSize: item.sizes?.[0] || 'M',
      selectedColor: item.colors?.[0] || 'Standard'
    };
    setSelectedProducts(prev => [...prev, newEquipped]);
    setActiveProduct(newEquipped);
    toast.success(`✨ Equipped ${item.name}!`);
  };

  const handleRemoveProduct = (productId) => {
    if (selectedProducts.length <= 1) {
      toast.error('At least one product must remain in the Try-On studio.');
      return;
    }
    const updated = selectedProducts.filter(p => (p._id || p.id) !== productId);
    setSelectedProducts(updated);
    if ((activeProduct?._id || activeProduct?.id) === productId) {
      setActiveProduct(updated[0] || null);
    }
    toast.success('Product removed from outfit.');
  };

  const handleRunAiFitting = async () => {
    setAiProcessing(true);
    setAiStep('Extracting anatomical landmarks...');
    await new Promise(r => setTimeout(r, 600));
    setAiStep('Segmenting body contours & target region...');
    await new Promise(r => setTimeout(r, 600));
    setAiStep('Synthesizing neural garment composite...');
    await new Promise(r => setTimeout(r, 600));
    setAiResultImage(userImage || null);
    setAiProcessing(false);
    toast.success('🎉 AI Virtual Fitting Applied!');
  };

  const handleAddOutfitToCart = () => {
    selectedProducts.forEach(item => {
      addToCart(item, 1, item.selectedSize || 'M', item.selectedColor || 'Standard');
    });
    toast.success(`🛒 Added ${selectedProducts.length} items to cart!`);
  };

  const handleBuyNow = () => {
    const p = activeProduct || selectedProducts[0];
    navigate(`/buy-now?productId=${p._id || p.id}&source=tryon`, {
      state: { product: p, outfit: selectedProducts }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Studio Title Header */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest">Interactive Fashion Studio</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Virtual Try-On & Outfit Studio
            </h1>
            <p className="text-xs text-gray-400">
              Fitting <strong className="text-rose-300">{activeProduct?.name}</strong> • {selectedProducts.length} items equipped
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartCamera}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FaCamera className="text-rose-400" />
              <span>Live Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              <FaUpload />
              <span>{userImage ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />
          </div>
        </div>

        {/* Studio Workspace: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Wardrobe Catalog (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/80 rounded-3xl border border-slate-800 p-4 flex flex-col max-h-[750px] shadow-xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
              <span>Wardrobe Catalog</span>
              <span className="text-rose-400">{filteredCatalog.length} items</span>
            </h3>

            {/* Search */}
            <input
              type="text"
              placeholder="Search garments, shoes, bags..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-3 outline-none focus:border-rose-500"
            />

            {/* Category Filter */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-3 slim-scrollbar">
              {['all', 'shirts', 'pants', 'shoes', 'women-dresses', 'handbags', 'watches'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat ? 'bg-rose-600 text-white' : 'bg-slate-950 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 slim-scrollbar">
              {filteredCatalog.map(p => (
                <div
                  key={p._id || p.id}
                  onClick={() => handleEquipProduct(p)}
                  className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between gap-2.5 cursor-pointer transition-all group"
                >
                  <img
                    src={p.images?.[0] || p.image}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-200 truncate group-hover:text-rose-300">{p.name}</p>
                    <p className="text-[10px] text-gray-400">₹{p.price} • {p.category}</p>
                  </div>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-rose-600 text-white flex items-center justify-center shrink-0 transition-colors"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Neutral Human Structure Canvas & 360 Studio (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
              
              {/* Studio Canvas Guides */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d35c73_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none"></div>

              {/* Camera Preview */}
              {cameraActive && !capturedPhotoTemp && (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 z-20">
                    <button onClick={handleCapturePhoto} className="bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
                      Capture
                    </button>
                    <button onClick={() => setCameraActive(false)} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Photo Temp Preview */}
              {cameraActive && capturedPhotoTemp && (
                <div className="relative w-full h-full">
                  <img src={capturedPhotoTemp} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 z-20">
                    <button onClick={handleUseCapturedPhoto} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
                      Use Photo
                    </button>
                    <button onClick={() => setCapturedPhotoTemp(null)} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs">
                      Retake
                    </button>
                  </div>
                </div>
              )}

              {/* Base Canvas */}
              {!cameraActive && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {userImage ? (
                    <img src={aiResultImage || userImage} alt="User Base" className="w-full h-full object-contain object-center" />
                  ) : (
                    <NeutralHumanStructure
                      silhouetteType={silhouetteType}
                      showLandmarks={showLandmarks}
                      activeTargetPart={activeProduct?.targetBodyPart}
                    />
                  )}

                  {/* Equipped Items Overlay */}
                  {!aiResultImage && selectedProducts.map(item => {
                    const coords = BODY_PART_COORDINATES[item.targetBodyPart] || BODY_PART_COORDINATES['upperBody'];
                    const img = item.images?.[0] || item.image;
                    if (!img) return null;
                    return (
                      <div
                        key={item._id || item.id}
                        style={{
                          position: 'absolute',
                          top: coords.top,
                          left: coords.left,
                          width: coords.width,
                          height: coords.height,
                          transform: coords.transform,
                          zIndex: item.layerPriority || 3
                        }}
                        className="pointer-events-none transition-all duration-300 flex items-center justify-center"
                      >
                        <img src={img} alt="" className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Canvas Tag */}
              <div className="absolute bottom-4 left-4 bg-slate-950/80 px-3 py-1 rounded-full text-[10px] font-bold text-gray-300 border border-slate-800">
                Base: <span className="text-rose-400 capitalize">{userImage ? 'Uploaded Photo' : `${silhouetteType} Neutral Silhouette`}</span>
              </div>
            </div>

            {/* AI Fitting Button */}
            <button
              type="button"
              onClick={handleRunAiFitting}
              disabled={aiProcessing}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer uppercase tracking-wider"
            >
              <FaMagic />
              <span>{aiProcessing ? aiStep : `✨ AI Virtual Fitting for Outfit (${selectedProducts.length} items)`}</span>
            </button>
          </div>

          {/* Right: Outfit Drawer, Details & Cart (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/80 rounded-3xl border border-slate-800 p-4 flex flex-col justify-between max-h-[750px] shadow-xl space-y-4">
            
            <div className="space-y-4 overflow-y-auto pr-1 slim-scrollbar">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center justify-between">
                <span>Active Outfit</span>
                <span className="text-rose-400 font-extrabold">₹{totalOutfitPrice}</span>
              </h3>

              {/* Equipped Items List */}
              <div className="space-y-2">
                {selectedProducts.map(item => (
                  <div
                    key={item._id || item.id}
                    onClick={() => setActiveProduct(item)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      (activeProduct?._id || activeProduct?.id) === (item._id || item.id)
                        ? 'bg-rose-950/40 border-rose-500/60 shadow-xs'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <img src={item.images?.[0] || item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">₹{item.price} • {item.targetBodyPart}</p>
                    </div>
                    {selectedProducts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(item._id || item.id);
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-rose-900 text-gray-400 hover:text-white flex items-center justify-center shrink-0"
                      >
                        <FaTrashAlt size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Suggested Pairings</span>
                <div className="space-y-1.5">
                  {recommendations.slice(0, 3).map(rec => (
                    <div key={rec._id || rec.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                      <img src={rec.images?.[0] || rec.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-gray-200 truncate">{rec.name}</p>
                        <p className="text-[9px] text-rose-400 font-bold">₹{rec.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEquipProduct(rec)}
                        className="px-2 py-1 bg-slate-800 hover:bg-rose-600 text-white rounded text-[10px] font-bold"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleAddOutfitToCart}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FaShoppingCart size={13} />
                <span>Add Outfit to Cart (₹{totalOutfitPrice})</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
              >
                <FaBolt size={13} />
                <span>Instant Buy Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default VirtualTryOn;
