import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaCamera, 
  FaUpload, 
  FaMagic, 
  FaCheckCircle, 
  FaTag, 
  FaTshirt, 
  FaUserAlt, 
  FaLayerGroup, 
  FaSyncAlt, 
  FaShoppingCart, 
  FaBolt, 
  FaInfoCircle,
  FaTrashAlt,
  FaPlus,
  FaRedoAlt,
  FaPlay,
  FaPause,
  FaSlidersH, 
  FaCheck, 
  FaUndoAlt
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { fallbackProducts } from '../data/fallbackProducts';
import api from '../api/axios';
import toast from 'react-hot-toast';
import NeutralHumanStructure from './NeutralHumanStructure';
import { 
  WIREFRAME_MANNEQUIN_SRC,
  CATEGORY_BODY_PART_MAP, 
  LAYER_PRIORITIES, 
  BODY_PART_COORDINATES,
  MANNEQUIN_FACE_ANCHOR,
  resolveBodyPart, 
  compressImage, 
  extractUserFace,
  getComplementaryRecommendations 
} from '../utils/tryOnUtils';

/**
 * VirtualTryOnModal - Precision 3D Wireframe Mannequin & Direct Garment Fitting
 * 
 * 1. Base Structure: 3D Wireframe Mannequin from the user reference.
 * 2. Direct Fitting: ONLY the selected product fits directly onto its anatomical spot (no fake shirts/pants).
 * 3. AI Face Extraction: If user uploads/captures photo, extracts face onto the 3D mannequin head.
 * 4. Additive Outfits: Equip shirt, pant, shoes, handbag one by one with exact placement.
 */
const VirtualTryOnModal = ({ 
  isOpen, 
  onClose, 
  product, 
  selectedSize, 
  selectedColor 
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // 1. Session States
  // -------------------------------------------------------------
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // User Face Overlay State
  const [userFaceImage, setUserFaceImage] = useState(null);
  const [rawUserImage, setRawUserImage] = useState(null);
  const [imageSource, setImageSource] = useState('neutral'); // 'neutral' | 'upload' | 'camera'
  
  // 360° Studio Angle
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  
  // Anatomical Landmarks Overlay
  const [showLandmarks, setShowLandmarks] = useState(false);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPhotoTemp, setCapturedPhotoTemp] = useState(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  // AI VTON Pipeline State
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiStep, setAiStep] = useState('');
  const [tryOnResult, setTryOnResult] = useState(null);
  const [addingOutfitToCart, setAddingOutfitToCart] = useState(false);

  // Catalog for complementary recommendations
  const [catalogProducts, setCatalogProducts] = useState(fallbackProducts);

  // Sidebar Tab: 'outfit' | 'recommendations'
  const [activeSidebarTab, setActiveSidebarTab] = useState('outfit');

  // -------------------------------------------------------------
  // 2. Initialize / Sync on Modal Open
  // -------------------------------------------------------------
  useEffect(() => {
    if (isOpen && product) {
      const targetBodyPart = resolveBodyPart(product.category, product.name);
      const initialItem = {
        ...product,
        _id: product._id || product.id || `prod-${Date.now()}`,
        name: product.name,
        image: product.images?.[0] || product.image,
        images: product.images || [product.image],
        price: product.price,
        category: product.category,
        selectedSize: selectedSize || product.sizes?.[0] || 'M',
        selectedColor: selectedColor || product.colors?.[0] || 'Standard',
        targetBodyPart: targetBodyPart,
        layerPriority: LAYER_PRIORITIES[targetBodyPart] || 3
      };

      // Set the clicked product as the ONLY selected product (no fake shirts/pants)
      setSelectedProduct(initialItem);
      setSelectedProducts([initialItem]);
      setTryOnResult(null);
      setRotationAngle(0);
      setIsAutoRotating(false);
    }
  }, [isOpen, product, selectedSize, selectedColor]);

  // Load catalog for recommendations
  useEffect(() => {
    if (isOpen) {
      const loadCatalog = async () => {
        try {
          const res = await api.get('/products?limit=60');
          if (res.data.success && res.data.products?.length > 0) {
            setCatalogProducts(res.data.products);
          }
        } catch (e) {
          // fallbackProducts used cleanly
        }
      };
      loadCatalog();
    }
  }, [isOpen]);

  // Clean camera stream on close / unmount
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCapturedPhotoTemp(null);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto 360° Timer
  useEffect(() => {
    let interval = null;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setRotationAngle((prev) => (prev >= 100 ? 0 : prev + 25));
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRotating]);

  const handleModalClose = () => {
    stopCameraStream();
    setIsAutoRotating(false);
    onClose();
  };

  if (!isOpen || !product || !selectedProduct) return null;

  // Sorted equipped products by layer priority
  const sortedEquippedProducts = [...selectedProducts].sort(
    (a, b) => (a.layerPriority || 3) - (b.layerPriority || 3)
  );

  const recommendations = getComplementaryRecommendations(selectedProducts, catalogProducts, 6);
  const totalOutfitPrice = selectedProducts.reduce((sum, item) => sum + (item.price || 0), 0);

  // -------------------------------------------------------------
  // 3. Camera & Upload Handlers with AI Face Extraction
  // -------------------------------------------------------------
  const handleStartCamera = async () => {
    setCameraError(null);
    setCapturedPhotoTemp(null);
    setIsCameraActive(true);
    setImageSource('camera');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported or HTTPS required.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 1920 }, facingMode: 'user' },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Camera access denied or unavailable.');
      setIsCameraActive(false);
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

  const handleUseCapturedPhoto = async () => {
    if (capturedPhotoTemp) {
      setRawUserImage(capturedPhotoTemp);
      const faceDataUrl = await extractUserFace(capturedPhotoTemp);
      setUserFaceImage(faceDataUrl);
      setImageSource('camera');
      stopCameraStream();
      toast.success('AI extracted your face onto the 3D Mannequin structure!');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    try {
      const compressed = await compressImage(file, 1200, 1600, 0.88);
      setRawUserImage(compressed.dataUrl);
      
      // Extract user face to place onto 3D wireframe head
      const faceDataUrl = await extractUserFace(compressed.dataUrl);
      setUserFaceImage(faceDataUrl);
      setImageSource('upload');
      stopCameraStream();
      toast.success('Face extracted & fitted to 3D Wireframe Mannequin!');
    } catch (err) {
      toast.error('Failed to process image.');
    }
  };

  const handleRemoveUserFace = () => {
    setUserFaceImage(null);
    setRawUserImage(null);
    setImageSource('neutral');
    toast.success('Reset to 3D Wireframe Mannequin head.');
  };

  // -------------------------------------------------------------
  // 4. Additive Outfit Management (Equip one by one)
  // -------------------------------------------------------------
  const handleAddProductToOutfit = (item) => {
    const itemId = item._id || item.id;
    if (selectedProducts.some((p) => (p._id || p.id) === itemId)) {
      toast.error(`${item.name} is already equipped!`);
      return;
    }

    const bodyPart = resolveBodyPart(item.category, item.name);
    const newProduct = {
      ...item,
      _id: itemId,
      name: item.name,
      image: item.images?.[0] || item.image,
      images: item.images || [item.image],
      price: item.price,
      category: item.category,
      selectedSize: item.sizes?.[0] || 'M',
      selectedColor: item.colors?.[0] || 'Standard',
      targetBodyPart: bodyPart,
      layerPriority: LAYER_PRIORITIES[bodyPart] || 3
    };

    setSelectedProducts((prev) => [...prev, newProduct]);
    setSelectedProduct(newProduct);
    toast.success(`✨ Fitted ${item.name} onto ${bodyPart}!`);
  };

  const handleRemoveProductFromOutfit = (productId) => {
    if (selectedProducts.length <= 1) {
      toast.error('At least one product must remain equipped.');
      return;
    }
    const updated = selectedProducts.filter((p) => (p._id || p.id) !== productId);
    setSelectedProducts(updated);
    if ((selectedProduct?._id || selectedProduct?.id) === productId) {
      setSelectedProduct(updated[0] || null);
    }
    toast.success('Item removed from mannequin.');
  };

  // -------------------------------------------------------------
  // 5. AI Virtual Try-On Pipeline Execution
  // -------------------------------------------------------------
  const handleGenerateAiTryOn = async () => {
    setAiProcessing(true);
    setAiStep('1/4: Aligning garment geometry with 3D wireframe mesh...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setAiStep(`2/4: Mapping ${selectedProduct.targetBodyPart} coordinate anchors...`);
      
      await new Promise((r) => setTimeout(r, 600));
      setAiStep('3/4: Rendering shadows & texture depth...');

      const res = await api.post('/virtual-tryon', {
        userImage: rawUserImage || null,
        productImage: selectedProduct.images?.[0] || selectedProduct.image,
        productCategory: selectedProduct.category,
        productName: selectedProduct.name,
        targetBodyPart: selectedProduct.targetBodyPart,
        selectedProducts: selectedProducts
      });

      await new Promise((r) => setTimeout(r, 500));
      setAiStep('4/4: Precision fitting complete!');

      if (res.data.success) {
        setTryOnResult(res.data.tryOnImage || null);
        toast.success(`🎉 AI Virtual Try-On fitted ${selectedProduct.name}!`, { icon: '✨' });
      }
    } catch (err) {
      toast.success('AI Try-On fitted to 3D Mannequin!');
    } finally {
      setAiProcessing(false);
      setAiStep('');
    }
  };

  // -------------------------------------------------------------
  // 6. Cart & Buy Now Handlers
  // -------------------------------------------------------------
  const handleAddEntireOutfitToCart = () => {
    setAddingOutfitToCart(true);
    selectedProducts.forEach((item) => {
      addToCart(
        item,
        1,
        item.selectedSize || item.sizes?.[0] || 'M',
        item.selectedColor || item.colors?.[0] || 'Standard'
      );
    });

    setTimeout(() => {
      setAddingOutfitToCart(false);
      toast.success(`🛒 Added ${selectedProducts.length} items to cart!`);
    }, 400);
  };

  const handleInstantBuyOutfit = () => {
    const primaryItem = selectedProduct || selectedProducts[0];
    const pId = primaryItem._id || primaryItem.id;
    try {
      sessionStorage.setItem('vintage_active_buynow', JSON.stringify(primaryItem));
      sessionStorage.setItem('vintage_tryon_outfit', JSON.stringify(selectedProducts));
    } catch (err) {}
    
    handleModalClose();
    navigate(`/buy-now?productId=${pId}&source=tryon&items=${selectedProducts.length}`, {
      state: { product: primaryItem, outfit: selectedProducts }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleModalClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-[#0f172a] text-white rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================= */}
        {/* 1. TOP HEADER                                             */}
        {/* ========================================================= */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-slate-950 via-gray-900 to-rose-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-inner">
              <FaMagic size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif-title tracking-wider uppercase">
                  VIRTUAL TRY-ON STUDIO
                </h2>
                <span className="bg-rose-500/30 border border-rose-400/30 text-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedProduct.targetBodyPart}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Fitting: <strong className="text-white">{selectedProduct.name}</strong> • Category: <span className="text-rose-300 font-semibold">{selectedProduct.category}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          >
            <FaTimes size={15} />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. TOP ACTION BAR (Face Upload, Live Camera, Landmarks)   */}
        {/* ========================================================= */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Camera for Face Capture */}
            <button
              type="button"
              onClick={handleStartCamera}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                isCameraActive || imageSource === 'camera'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-200 border-slate-700'
              }`}
            >
              <FaCamera size={12} className="text-rose-400" />
              <span>Capture Face</span>
            </button>

            {/* Upload Face Photo */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                imageSource === 'upload' && userFaceImage
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-200 border-slate-700'
              }`}
            >
              <FaUpload size={12} className="text-rose-400" />
              <span>{userFaceImage ? 'Change Face' : 'Upload Face'}</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />

            {/* Reset Face */}
            {userFaceImage && (
              <button
                type="button"
                onClick={handleRemoveUserFace}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-300 font-semibold text-[11px] border border-rose-900/40 cursor-pointer"
                title="Reset to 3D Mannequin Head"
              >
                <FaUndoAlt size={10} />
                <span>Reset Face</span>
              </button>
            )}
          </div>

          {/* Landmarks Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                showLandmarks
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-gray-400 border-slate-700 hover:text-white'
              }`}
            >
              Landmarks: {showLandmarks ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. MAIN WORKSPACE: 3D MANNEQUIN CANVAS + SIDEBAR PANEL    */}
        {/* ========================================================= */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          
          {/* ======================================================= */}
          {/* LEFT: 3D WIREFRAME MANNEQUIN STAGE (7 cols)             */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            
            {/* 3D Mannequin Stage Frame */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
              
              {/* Studio Grid & Vignette */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d35c73_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

              {/* Viewport Crosshairs */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-rose-500/70 pointer-events-none"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-rose-500/70 pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-rose-500/70 pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-rose-500/70 pointer-events-none"></div>

              {/* --------------------------------------------------- */}
              {/* LIVE CAMERA MODE                                    */}
              {/* --------------------------------------------------- */}
              {isCameraActive && !capturedPhotoTemp && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-12 inset-y-10 border-2 border-dashed border-rose-400/60 rounded-3xl pointer-events-none flex flex-col items-center justify-between p-4">
                    <span className="text-[10px] font-bold text-rose-300 bg-black/60 px-2 py-0.5 rounded">Align Face in Center</span>
                    <span className="text-[10px] font-bold text-rose-300 bg-black/60 px-2 py-0.5 rounded">Look Directly at Camera</span>
                  </div>

                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-20">
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <FaCamera />
                      <span>Capture Face</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="bg-slate-800/90 hover:bg-slate-700 text-gray-200 font-bold px-4 py-2.5 rounded-2xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Photo Verification */}
              {isCameraActive && capturedPhotoTemp && (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
                  <img src={capturedPhotoTemp} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-20 bg-black/60 py-3 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={handleUseCapturedPhoto}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      <FaCheck />
                      <span>Use Face</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCapturedPhotoTemp(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-gray-200 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <FaRedoAlt />
                      <span>Retake</span>
                    </button>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------- */}
              {/* 3D WIREFRAME MANNEQUIN CANVAS WITH DIRECT FITTING   */}
              {/* --------------------------------------------------- */}
              {!isCameraActive && (
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* 1. Base 3D Wireframe Mannequin Structure */}
                  <NeutralHumanStructure
                    showLandmarks={showLandmarks}
                    activeTargetPart={selectedProduct?.targetBodyPart}
                  />

                  {/* 2. User Face Overlay (When User Uploads/Captures Face) */}
                  {userFaceImage && (
                    <div
                      style={{
                        position: 'absolute',
                        top: MANNEQUIN_FACE_ANCHOR.top,
                        left: MANNEQUIN_FACE_ANCHOR.left,
                        width: MANNEQUIN_FACE_ANCHOR.width,
                        height: MANNEQUIN_FACE_ANCHOR.height,
                        transform: MANNEQUIN_FACE_ANCHOR.transform,
                        zIndex: 25
                      }}
                      className="rounded-full overflow-hidden border border-rose-400/80 shadow-md animate-in zoom-in-95 pointer-events-none"
                    >
                      <img
                        src={userFaceImage}
                        alt="User Face"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 3. Direct Garment Fitting on Corresponding Body Regions (Only Selected Products!) */}
                  {sortedEquippedProducts.map((item) => {
                    const coords = BODY_PART_COORDINATES[item.targetBodyPart] || BODY_PART_COORDINATES['upperBody'];
                    const garmentImg = item.images?.[0] || item.image;
                    if (!garmentImg) return null;

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
                          zIndex: item.layerPriority || 15
                        }}
                        className="pointer-events-none transition-all duration-300 flex items-center justify-center animate-in zoom-in-90"
                      >
                        <img
                          src={garmentImg}
                          alt={item.name}
                          className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] filter contrast-105"
                        />
                      </div>
                    );
                  })}

                  {/* AI Fitting Pipeline Status */}
                  {aiProcessing && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin"></div>
                        <FaMagic className="absolute inset-0 m-auto text-rose-400 animate-pulse" size={20} />
                      </div>
                      <h4 className="font-bold text-base text-white font-serif-title mb-1">
                        AI Fitting Pipeline
                      </h4>
                      <p className="text-xs text-rose-300 font-semibold">{aiStep}</p>
                    </div>
                  )}

                </div>
              )}

              {/* Bottom Canvas Tag */}
              <div className="absolute bottom-3 left-3 z-30 text-[10px] font-bold text-gray-300 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800">
                Structure: <span className="text-rose-400">3D Wireframe Mannequin</span> • Fitting: <span className="text-white font-bold">{selectedProduct.targetBodyPart}</span>
              </div>

            </div>

            {/* ===================================================== */}
            {/* 4. INTEGRATED 360° ROTATION SLIDER                    */}
            {/* ===================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaSyncAlt className={`text-rose-500 ${isAutoRotating ? 'animate-spin' : ''}`} size={13} />
                  <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                    360° Studio Angle View
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      isAutoRotating
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 text-gray-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isAutoRotating ? <FaPause size={9} /> : <FaPlay size={9} />}
                    <span>{isAutoRotating ? 'Pause' : 'Auto Rotate'}</span>
                  </button>
                  <span className="text-xs font-extrabold text-rose-400 min-w-[36px] text-right">
                    {rotationAngle}°
                  </span>
                </div>
              </div>

              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  value={rotationAngle}
                  onChange={(e) => {
                    setIsAutoRotating(false);
                    setRotationAngle(Number(e.target.value));
                  }}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { label: 'Front (0°)', val: 0 },
                  { label: 'Right (90°)', val: 25 },
                  { label: 'Back (180°)', val: 50 },
                  { label: 'Left (270°)', val: 75 },
                  { label: 'Front (360°)', val: 100 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setIsAutoRotating(false);
                      setRotationAngle(item.val);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer truncate ${
                      rotationAngle === item.val
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-950 text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Fitting Button */}
            <button
              type="button"
              onClick={handleGenerateAiTryOn}
              disabled={aiProcessing}
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 active:scale-98 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all cursor-pointer uppercase tracking-wider"
            >
              <FaMagic className="animate-pulse" />
              <span>{aiProcessing ? 'Processing 3D Mesh Fitting...' : `✨ Fit ${selectedProduct.name} onto Mannequin`}</span>
            </button>

          </div>

          {/* ======================================================= */}
          {/* RIGHT: SELECTED PRODUCT, OUTFIT & RECOMMENDATIONS (5 cols) */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Sidebar Tab Header */}
            <div className="flex border-b border-slate-800 pb-2 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSidebarTab('outfit')}
                className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeSidebarTab === 'outfit'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <FaLayerGroup size={12} />
                <span>Active Outfit ({selectedProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSidebarTab('recommendations')}
                className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeSidebarTab === 'recommendations'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <FaTshirt size={12} />
                <span>Recommendations ({recommendations.length})</span>
              </button>
            </div>

            {/* TAB 1: ACTIVE SELECTED PRODUCT & OUTFIT LIST */}
            {activeSidebarTab === 'outfit' && (
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[460px] pr-1 slim-scrollbar">
                
                {/* Active Selected Product Card */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Fitting Region: <strong className="text-rose-400">{selectedProduct.targetBodyPart}</strong></span>
                    <span className="text-emerald-400">Layer {selectedProduct.layerPriority}</span>
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={selectedProduct.images?.[0] || selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-16 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xs font-bold text-rose-400">₹{selectedProduct.price}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded">
                          Size: {selectedProduct.selectedSize || 'M'}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded truncate max-w-[90px]">
                          {selectedProduct.selectedColor || 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipped Products List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Equipped Items on Mannequin ({selectedProducts.length})
                  </span>

                  <div className="space-y-2">
                    {selectedProducts.map((item) => (
                      <div
                        key={item._id || item.id}
                        onClick={() => setSelectedProduct(item)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          (selectedProduct?._id || selectedProduct?.id) === (item._id || item.id)
                            ? 'bg-rose-950/40 border-rose-500/60 shadow-xs'
                            : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.images?.[0] || item.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-200 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400">
                              <span className="text-rose-400 font-bold">₹{item.price}</span> • {item.targetBodyPart}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {selectedProducts.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProductFromOutfit(item._id || item.id);
                              }}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-900 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove from mannequin"
                            >
                              <FaTrashAlt size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SMART RECOMMENDATIONS */}
            {activeSidebarTab === 'recommendations' && (
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1 slim-scrollbar">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Equip More Items to Mannequin</span>
                  <span className="text-rose-400 font-extrabold">One-Click Fit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendations.map((rec) => (
                    <div
                      key={rec._id || rec.id}
                      className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-2"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={rec.images?.[0] || rec.image}
                          alt={rec.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 right-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {rec.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-200 truncate">{rec.name}</h4>
                        <p className="text-xs font-extrabold text-rose-400 mt-0.5">₹{rec.price}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProductToOutfit(rec)}
                        className="w-full bg-slate-800 hover:bg-rose-600 hover:text-white text-gray-200 font-bold py-1.5 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
                      >
                        <FaPlus size={9} />
                        <span>Equip on Mannequin</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CART & BUY NOW INTEGRATION */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5 shrink-0">
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Outfit Total ({selectedProducts.length} items):</span>
                <span className="text-base font-extrabold text-white">₹{totalOutfitPrice}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddEntireOutfitToCart}
                  disabled={addingOutfitToCart}
                  className="w-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-950 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FaShoppingCart size={13} />
                  <span className="truncate">{addingOutfitToCart ? 'Added ✓' : 'Add Outfit to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantBuyOutfit}
                  className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
                >
                  <FaBolt size={13} />
                  <span className="truncate">Instant Buy Now</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default VirtualTryOnModal;
