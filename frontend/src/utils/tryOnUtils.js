/**
 * Virtual Try-On Utilities - Neutral Anatomy, Robust Mapping & Image Processing
 * 
 * Provides:
 * - Category to body region resolution
 * - Accurate anatomical coordinates
 * - Canvas image compression
 * - Complementary product matching
 */

// Category to Body Region Map
export const CATEGORY_BODY_PART_MAP = {
  // Upper body
  'shirts': 'upperBody',
  't-shirts': 'upperBody',
  'women-tops': 'upperBody',
  'jackets': 'upperBody',
  'coats': 'upperBody',
  'sweaters': 'upperBody',
  'tops': 'upperBody',
  'polos': 'upperBody',
  
  // Lower body
  'pants': 'lowerBody',
  'jeans': 'lowerBody',
  'trousers': 'lowerBody',
  'shorts': 'upperLegs',
  'skirts': 'lowerBody',
  'cargos': 'lowerBody',
  
  // Full body
  'women-dresses': 'fullBody',
  'women-sarees': 'fullBody',
  'dresses': 'fullBody',
  'sarees': 'fullBody',
  'gowns': 'fullBody',
  
  // Feet
  'shoes': 'feet',
  'sneakers': 'feet',
  'sandals': 'feet',
  'heels': 'feet',
  'women-footwear': 'feet',
  'footwear': 'feet',
  'boots': 'feet',
  'loafers': 'feet',
  
  // Hand / Arm (Handbags, totes, clutches)
  'handbags': 'handArm',
  'handbag': 'handArm',
  'bags': 'handArm',
  'bag': 'handArm',
  'women-handbags': 'handArm',
  'women-bags': 'handArm',
  'clutches': 'handArm',
  'totes': 'handArm',
  'backpacks': 'shouldersBack',
  
  // Jewelry & Accessories
  'watches': 'wrist',
  'bracelets': 'wrist',
  'rings': 'finger',
  'necklace': 'neck',
  'women-jewelry': 'neck',
  'jewelry': 'neck',
  'earrings': 'ears',
  'hats': 'head',
  'caps': 'head',
  'glasses': 'face',
  'sunglasses': 'face'
};

// Layer priorities: Lower numbers render underneath higher numbers
export const LAYER_PRIORITIES = {
  'feet': 1,
  'lowerBody': 2,
  'upperLegs': 2,
  'upperBody': 3,
  'fullBody': 3,
  'neck': 4,
  'wrist': 4,
  'finger': 4,
  'ears': 4,
  'handArm': 5,
  'shouldersBack': 5,
  'face': 6,
  'head': 6
};

// Precise anatomical coordinate anchors on the neutral human structure
export const BODY_PART_COORDINATES = {
  'head': { top: '3%', left: '50%', width: '28%', height: '14%', transform: 'translate(-50%, 0)' },
  'face': { top: '8%', left: '50%', width: '22%', height: '10%', transform: 'translate(-50%, 0)' },
  'neck': { top: '15%', left: '50%', width: '24%', height: '12%', transform: 'translate(-50%, 0)' },
  'upperBody': { top: '18%', left: '50%', width: '56%', height: '38%', transform: 'translate(-50%, 0)' },
  'fullBody': { top: '18%', left: '50%', width: '60%', height: '65%', transform: 'translate(-50%, 0)' },
  'lowerBody': { top: '48%', left: '50%', width: '46%', height: '42%', transform: 'translate(-50%, 0)' },
  'upperLegs': { top: '48%', left: '50%', width: '44%', height: '24%', transform: 'translate(-50%, 0)' },
  'feet': { top: '82%', left: '50%', width: '46%', height: '15%', transform: 'translate(-50%, 0)' },
  'wrist': { top: '48%', left: '22%', width: '16%', height: '16%', transform: 'translate(-50%, 0)' },
  'finger': { top: '54%', left: '20%', width: '12%', height: '12%', transform: 'translate(-50%, 0)' },
  'handArm': { top: '42%', left: '76%', width: '30%', height: '32%', transform: 'translate(-50%, 0)' },
  'shouldersBack': { top: '22%', left: '50%', width: '48%', height: '40%', transform: 'translate(-50%, 0)' }
};

/**
 * Resolves body part from product category and name dynamically
 */
export const resolveBodyPart = (category = '', name = '') => {
  const cat = (category || '').toLowerCase().trim();
  const n = (name || '').toLowerCase().trim();

  // 1. Check exact category mapping
  if (CATEGORY_BODY_PART_MAP[cat]) {
    return CATEGORY_BODY_PART_MAP[cat];
  }

  // 2. Check handbag keywords
  if (
    cat.includes('bag') || 
    cat.includes('handbag') || 
    n.includes('handbag') || 
    n.includes('tote') || 
    n.includes('clutch') || 
    n.includes('purse') || 
    n.includes('satchel') || 
    n.includes('shoulder bag') ||
    n.includes('crossbody')
  ) {
    return 'handArm';
  }

  // 3. Check full body keywords (dress, saree, gown)
  if (
    cat.includes('dress') || 
    cat.includes('saree') || 
    cat.includes('gown') || 
    n.includes('dress') || 
    n.includes('saree') || 
    n.includes('gown') || 
    n.includes('anarkali') || 
    n.includes('lehenga')
  ) {
    return 'fullBody';
  }

  // 4. Check lower body keywords (pants, cargos, jeans)
  if (
    cat.includes('pant') || 
    cat.includes('cargo') || 
    cat.includes('jean') || 
    cat.includes('trouser') || 
    n.includes('pant') || 
    n.includes('cargo') || 
    n.includes('jean') || 
    n.includes('trouser') || 
    n.includes('jogger')
  ) {
    return 'lowerBody';
  }

  // 5. Check footwear keywords
  if (
    cat.includes('shoe') || 
    cat.includes('footwear') || 
    n.includes('shoe') || 
    n.includes('sneaker') || 
    n.includes('boot') || 
    n.includes('sandal') || 
    n.includes('heel') || 
    n.includes('loafer')
  ) {
    return 'feet';
  }

  // 6. Check jewelry & accessories
  if (n.includes('watch') || n.includes('timepiece') || n.includes('bracelet')) return 'wrist';
  if (n.includes('ring') || n.includes('band')) return 'finger';
  if (n.includes('necklace') || n.includes('pendant') || n.includes('choker') || n.includes('chain') || cat.includes('jewelry')) return 'neck';
  if (n.includes('hat') || n.includes('cap') || n.includes('beanie')) return 'head';
  if (n.includes('glass') || n.includes('sunglass') || n.includes('spectacle')) return 'face';
  if (n.includes('backpack')) return 'shouldersBack';

  // 7. Upper body (shirts, tops, t-shirts, jackets)
  if (
    cat.includes('shirt') || 
    cat.includes('top') || 
    n.includes('shirt') || 
    n.includes('polo') || 
    n.includes('top') || 
    n.includes('tee') || 
    n.includes('jacket') || 
    n.includes('sweater') || 
    n.includes('hoodie') ||
    n.includes('kurti')
  ) {
    return 'upperBody';
  }

  return 'upperBody';
};

/**
 * Client-Side Image Compression using HTML Canvas
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file format. Supported: JPG, JPEG, PNG.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
          sizeBytes: Math.round((dataUrl.length * 3) / 4)
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
  });
};

/**
 * Smart Complementary Recommendations Engine
 * Generates matching suggestions without replacing the active product.
 */
export const getComplementaryRecommendations = (selectedProducts = [], allProducts = [], limit = 6) => {
  if (!allProducts || allProducts.length === 0) return [];
  
  const activeIds = new Set(selectedProducts.map(p => p._id || p.id));
  const activeCategories = new Set(selectedProducts.map(p => (p.category || '').toLowerCase()));

  const COMP_MAP = {
    'pants': ['shirts', 'women-tops', 'shoes', 'women-footwear', 'watches', 'handbags'],
    'jeans': ['shirts', 'women-tops', 'shoes', 'women-footwear', 'watches'],
    'shirts': ['pants', 'shoes', 'watches', 'rings', 'backpacks'],
    'women-tops': ['pants', 'women-footwear', 'women-jewelry', 'handbags'],
    'women-dresses': ['women-footwear', 'women-jewelry', 'handbags'],
    'women-sarees': ['women-jewelry', 'women-footwear', 'handbags'],
    'handbags': ['women-dresses', 'women-tops', 'women-footwear', 'women-jewelry', 'pants'],
    'bags': ['shirts', 'pants', 'shoes', 'watches'],
    'shoes': ['pants', 'shirts', 'women-dresses', 'watches', 'handbags'],
    'women-footwear': ['women-dresses', 'women-sarees', 'women-tops', 'women-jewelry', 'handbags'],
    'watches': ['shirts', 'pants', 'rings', 'shoes'],
    'rings': ['watches', 'shirts', 'women-jewelry'],
    'women-jewelry': ['women-dresses', 'women-sarees', 'women-tops', 'women-footwear', 'handbags']
  };

  let targetCategories = [];
  activeCategories.forEach(cat => {
    if (COMP_MAP[cat]) {
      targetCategories.push(...COMP_MAP[cat]);
    }
  });

  if (targetCategories.length === 0) {
    targetCategories = ['shirts', 'pants', 'shoes', 'watches', 'women-dresses', 'women-jewelry', 'handbags'];
  }

  // Filter products matching target complementary categories that are NOT already in the active outfit
  const candidates = allProducts.filter(p => {
    const pId = p._id || p.id;
    const pCat = (p.category || '').toLowerCase();
    return !activeIds.has(pId) && targetCategories.includes(pCat);
  });

  if (candidates.length < limit) {
    const remaining = allProducts.filter(p => {
      const pId = p._id || p.id;
      return !activeIds.has(pId) && !candidates.some(c => (c._id || c.id) === pId);
    });
    return [...candidates, ...remaining].slice(0, limit);
  }

  return candidates.slice(0, limit);
};
