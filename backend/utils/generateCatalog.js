// Catalog Generator for VintageDreams with 50+ rich products per category (500+ total)

const shirtImages = [
  'https://m.media-amazon.com/images/I/81dszCJ0etL._SY879_.jpg',
  'https://m.media-amazon.com/images/I/71IU11W8asL._SY741_.jpg',
  'https://m.media-amazon.com/images/I/611SbasaFRL._SY741_.jpg',
  'https://m.media-amazon.com/images/I/61rRjFn9FJL._AC_UL480_QL65_.jpg',
  'https://m.media-amazon.com/images/I/71V5gEc8YVL._SY879_.jpg',
  'https://m.media-amazon.com/images/I/71x4rLhMkML._SY879_.jpg',
  'https://m.media-amazon.com/images/I/617QdnlnfZL._SY879_.jpg',
  'https://m.media-amazon.com/images/I/51Txwy6l6CL.jpg',
  'https://m.media-amazon.com/images/I/71BwxuB0p-L._SY879_.jpg',
  'https://m.media-amazon.com/images/I/71DQ6U-OVQL._SY879_.jpg',
  'https://m.media-amazon.com/images/I/61uKUY6hQ7L._SY741_.jpg',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'
];

const pantImages = [
  'https://m.media-amazon.com/images/I/61wd080+AxL._SY741_.jpg',
  'https://m.media-amazon.com/images/I/610IIi6wHuL._SY879_.jpg',
  'https://m.media-amazon.com/images/I/61m5W8DEuLL._SY741_.jpg',
  'https://m.media-amazon.com/images/I/61j9jJhrStL._SY879_.jpg',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
  'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80',
  'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80'
];

const shoeImages = [
  'https://m.media-amazon.com/images/I/71aFuiEntML._SY695_.jpg',
  'https://m.media-amazon.com/images/I/61I0AJDKA0S._SY695_.jpg',
  'https://m.media-amazon.com/images/I/71OPYKJ4nuL._SX695_.jpg',
  'https://m.media-amazon.com/images/I/61u2GljumvL._SY695_.jpg',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80'
];

const watchImages = [
  'https://m.media-amazon.com/images/I/81kLhCWFSjL._SX679_.jpg',
  'https://m.media-amazon.com/images/I/71AjeVD1bPL._SX679_.jpg',
  'https://m.media-amazon.com/images/I/711NXCmUfbL._SX679_.jpg',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'
];

const ringImages = [
  'https://m.media-amazon.com/images/I/511QHTo6j3L._SY625_.jpg',
  'https://m.media-amazon.com/images/I/519HMAUTrQL._SY625_.jpg',
  'https://m.media-amazon.com/images/I/41UfkhGo3eL._SY695_.jpg',
  'https://m.media-amazon.com/images/I/61ahdD6ANdL._SY625_.jpg',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'
];

const dressImages = [
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
  'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80'
];

const topImages = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
  'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&q=80',
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
  'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
  'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80'
];

const jewelImages = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  'https://images.unsplash.com/photo-1611591475166-068305c48834?w=800&q=80',
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80'
];

const sareeImages = [
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'
];

const wFootwearImages = [
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
  'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
];

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const shoeSizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const ringSizes = ['14', '16', '18', '20', '22', '24'];

const generateProducts = () => {
  const list = [];
  let count = 1;

  // Helper generator
  const createCategoryItems = (cat, gender, names, images, sizes, colorList, basePrice, brandList) => {
    for (let i = 0; i < 52; i++) {
      const namePattern = names[i % names.length];
      const name = `${namePattern} ${i > names.length - 1 ? `Vol. ${Math.floor(i / names.length) + 1}` : ''}`.trim();
      const img = images[i % images.length];
      const brand = brandList[i % brandList.length];
      const price = basePrice + (i * 37) % 1800;
      const originalPrice = Math.round(price * (1.3 + (i % 5) * 0.1));

      list.push({
        name,
        description: `Premium handcrafted ${name} designed with authentic ${gender === 'men' ? "men's" : "women's"} tailoring, breathable fabrics, and durable stitching. Perfect for casual wear, office elegance, or special evening occasions.`,
        price,
        originalPrice,
        category: cat,
        gender,
        images: [img],
        sizes,
        colors: colorList,
        brand,
        stock: 20 + (i % 40),
        rating: +(4.1 + (i % 9) * 0.1).toFixed(1),
        numReviews: 18 + (i * 14) % 450,
        isFeatured: i % 7 === 0,
        isTrending: i % 5 === 0,
        tags: [cat, gender, brand.toLowerCase(), 'fashion', 'vintagedreams']
      });
    }
  };

  // 1. MEN - SHIRTS (52 products)
  createCategoryItems(
    'shirts',
    'men',
    [
      'Lymio Casual Cotton Regular Fit Shirt',
      'The Souled Store Plaid Utility Shirt',
      'Arrow Executive Pure Cotton Formal Shirt',
      'Lymio Modern Stretch Ribbed Textured Shirt',
      'Symbol Classic Button-Down Oxford Shirt',
      'OTUS Vintage Vertical Striped Shirt',
      'The Souled Store Solids Faded Sage Shirt',
      'Van Heusen Slim Fit Wrinkle-Free Shirt',
      'Park Avenue Executive Luxury Dress Shirt',
      'Allen Solly Streetwear Oversized Shirt',
      'Blackberrys Textured Weave Formal Shirt',
      'US Polo Assn Classic Pique Polo T-Shirt',
      'Louis Philippe Royal Luxury Satin Shirt',
      'Peter England Solid Mandarin Collar Shirt',
      'Highlander Casual Denim Washed Shirt'
    ],
    shirtImages,
    allSizes,
    ['Black', 'White', 'Navy Blue', 'Wine Red', 'Sage Green', 'Charcoal'],
    349,
    ['Lymio', 'The Souled Store', 'Arrow', 'Symbol', 'Louis Philippe', 'Allen Solly']
  );

  // 2. MEN - PANTS & CARGOS (52 products)
  createCategoryItems(
    'pants',
    'men',
    [
      'The Souled Store Solids Heavyweight Cotton Cargos',
      'Lymio 6-Pocket Tactical Street Cargo Pants',
      'Symbol Premium Stretch Chino Trousers',
      'Levi Strauss 511 Slim Fit Denim Jeans',
      'Lymio Athletic Fleece Jogger Track Pants',
      'Highlander Relaxed Fit Ankle Length Trousers',
      'Peter England Smart Casual Flat Front Pants',
      'Wrangler Heavy Duty Outdoor Khaki Cargos',
      'Van Heusen Formal Wrinkle-Resistant Trousers',
      'Blackberrys Tailored Fit Wool Blend Pants',
      'Urban Monkey Baggy Skateboarding Cargo Pants',
      'Flying Machine Tapered Fit Indigo Jeans'
    ],
    pantImages,
    ['30', '32', '34', '36', '38', '40'],
    ['Khaki Brown', 'Olive Green', 'Jet Black', 'Navy', 'Steel Grey'],
    599,
    ['The Souled Store', 'Lymio', 'Symbol', 'Levis', 'Highlander']
  );

  // 3. MEN - SHOES & SNEAKERS (52 products)
  createCategoryItems(
    'shoes',
    'men',
    [
      "U.S. POLO ASSN. Men's Leather Lifestyle Sneaker",
      "U.S. POLO ASSN. Retro Low-Top Canvas Shoes",
      'Red Tape Classic Handcrafted Leather Loafers',
      'Puma Vintage Court Star Tennis Sneakers',
      'Bata Men Formal Oxford Leather Dress Shoes',
      'Woodland Rugged Nubuck Leather High-Ankle Boots',
      'Nike Air Court Vintage Streetwear Trainers',
      'Adidas Originals Continental Athletic Shoes',
      'Sparx Casual Lightweight Breathable Sneakers',
      'Campus Air Capsule Cushion Running Shoes'
    ],
    shoeImages,
    shoeSizes,
    ['Triple White', 'Black/White', 'Navy Blue', 'Tan Brown', 'Olive'],
    1299,
    ['U.S. POLO ASSN.', 'Puma', 'Red Tape', 'Woodland', 'Adidas']
  );

  // 4. WATCHES (52 products)
  createCategoryItems(
    'watches',
    'men',
    [
      'LOUIS DEVIN Luxury Leather Strap Analog Wrist Watch',
      'Matrix Antique Dual Day & Date Calendar Watch',
      'Matrix 2.0 Matte Black Silicone Sport Chronograph',
      'Titan Classic Champagne Dial Stainless Steel Watch',
      'Fossil Minimalist Chronograph Brown Leather Watch',
      'Casio Vintage Gold Tone Digital Retro Watch',
      'Timex Expedition Rugged Waterproof Analog Watch',
      'Fastrack Bold All-Black Designer Casual Watch',
      'Sonata Ocean Series Stainless Steel Water Resistant Watch',
      'Citizen Eco-Drive Skeleton Automatic Timepiece'
    ],
    watchImages,
    ['Free Size', 'Standard Fit'],
    ['Antique Brown', 'Midnight Black', 'Gold / Silver', 'Navy Blue'],
    289,
    ['LOUIS DEVIN', 'Matrix', 'Titan', 'Fossil', 'Casio', 'Timex']
  );

  // 5. MEN - 925 SILVER RINGS & JEWELRY (52 products)
  createCategoryItems(
    'rings',
    'men',
    [
      'GIVA 925 Pure Sterling Silver Classic Band Ring',
      'Clara Pure 925 Oxidised Gothic Cross Ring',
      'Clara Platinum Plated Infinity Motif Masculine Ring',
      'ZAVYA Solid AAA CZ Studded Signet Silver Ring',
      'Voylla Royal Rajputana Antique Floral Carved Ring',
      'GIVA Black Onyx Stone 925 Sterling Silver Ring',
      'Karatcart Roman Numeral Spinner Titanium Band',
      'ZAVYA Lion Head Regal Embossed Silver Ring',
      'Clara Minimalist Beveled Edge Pure Silver Ring',
      'GIVA Celtic Knot Handcrafted Pure Silver Band'
    ],
    ringImages,
    ringSizes,
    ['925 Pure Silver', 'Oxidized Silver', 'Rose Gold Plated', 'Platinum Shine'],
    899,
    ['GIVA', 'Clara', 'ZAVYA', 'Voylla', 'Karatcart']
  );

  // 6. WOMEN - DRESSES & GOWNS (52 products)
  createCategoryItems(
    'women-dresses',
    'women',
    [
      'Vintage Dreams Floral Printed Sweetheart Midi Dress',
      'Vintage Elegance Glossy Satin Wrap Evening Gown',
      'Berrylush V-Neck Ruffled Hem Tiered Maxi Dress',
      'Tokyo Talkies Bodycon Slit Partywear Cocktail Dress',
      'Harpa Square Neck Lantern Sleeve Fit & Flare Dress',
      'Athena Elegant Velvet A-Line Evening Gown',
      'Street 9 Boho Chic Tiered Cotton Summer Dress',
      'Sassafras Ribbed Knit Long Sleeve Sweater Dress',
      'Rare Bohemian Embroidered Georgette Maxi Dress',
      'FabAlley Shimmer Sequin Halter Neck Gown'
    ],
    dressImages,
    allSizes,
    ['Floral Pink', 'Burgundy Wine', 'Emerald Green', 'Sky Blue', 'Midnight Black'],
    799,
    ['Vintage Dreams', 'Berrylush', 'Tokyo Talkies', 'Harpa', 'FabAlley']
  );

  // 7. WOMEN - TOPS, KURTIS & SHIRTS (52 products)
  createCategoryItems(
    'women-tops',
    'women',
    [
      'Embroidered Chikankari Pure Cotton Kurti & Pant Set',
      'Vintage Dreams Oversized Crop Shirt with Puff Sleeves',
      'Biba Traditional Printed Anarkali Kurta Set',
      'W for Woman Solid Straight Fit Rayon Tunic',
      'Aurelia Handblock Printed Festive Kurti',
      'Vero Moda Elegant Satin Formal Button-Up Blouse',
      'ONLY Casual Ribbed Square Neck Crop Top',
      'FabIndia Handwoven Khadi Cotton Peplum Top',
      'Madame Floral Printed Chiffon Ruffled Blouse',
      'Global Desi Bohemian Embroidered Fusion Tunic'
    ],
    topImages,
    allSizes,
    ['Powder Blue', 'Pastel Peach', 'Mint Green', 'Ivory White', 'Mustard Yellow'],
    549,
    ['Vintage Dreams', 'Biba', 'W for Woman', 'FabIndia', 'Vero Moda']
  );

  // 8. WOMEN - FINE JEWELRY (52 products)
  createCategoryItems(
    'women-jewelry',
    'women',
    [
      'GIVA 925 Sterling Silver Rose Gold Plated Heart Necklace',
      'GIVA Shimmering Zircon Solitaire Dainty Pendant Chain',
      'Clara Pure 925 Silver Classic Tennis Bracelet',
      'ZAVYA Floral Bloom Cubic Zirconia Drop Earrings',
      'Voylla Kundan Pearl Bridal Choker Set',
      'GIVA Feather Motif Platinum Plated Anklet',
      'Karatcart Traditional Temple Jewelry Layered Necklace',
      'ZAVYA Butterfly Motif Layered Sterling Silver Chain',
      'Clara Emerald Cut American Diamond Stud Earrings',
      'GIVA Rose Gold Solitaire Ring with Adjustable Band'
    ],
    jewelImages,
    ['Adjustable (Free Size)', 'Standard'],
    ['Rose Gold', '925 Platinum Silver', '18K Gold Plated', 'Pearl White'],
    1199,
    ['GIVA', 'Clara', 'ZAVYA', 'Voylla', 'Karatcart']
  );

  // 9. WOMEN - SAREES & ETHNIC WEAR (52 products)
  createCategoryItems(
    'women-sarees',
    'women',
    [
      'Royal Heritage Kanjivaram Pure Art Silk Zari Saree',
      'Banarasi Woven Brocade Silk Wedding Saree with Blouse',
      'Chanderi Handloom Cotton Silk Festive Saree',
      'Bollywood Georgette Ruffle Saree with Sequin Border',
      'Kalamkari Hand Painted Pure Cotton Heritage Saree',
      'Tussar Silk Embroidered Temple Border Designer Saree',
      'Mysore Silk Traditional Golden Zari Weave Saree',
      'Bandhani Bandhej Jaipuri Pure Silk Saree',
      'Organza Floral Printed Pastel Partywear Saree',
      'Paithani Pure Silk Traditional Peacock Motif Saree'
    ],
    sareeImages,
    ['5.5m Saree + 0.8m Blouse Piece (Free Size)'],
    ['Royal Maroon Gold', 'Peacock Green', 'Mustard Gold', 'Pastel Pink', 'Deep Magenta'],
    1899,
    ['Vintage Dreams Heritage', 'Banarasi Weaves', 'Kanjivaram Silk', 'FabIndia']
  );

  // 10. WOMEN - FOOTWEAR & HANDBAGS (52 products)
  createCategoryItems(
    'women-footwear',
    'women',
    [
      'Vintage Dreams Handcrafted Leather Block Heel Sandals',
      'Metro Classic Pointed-Toe Stiletto Pumps',
      'Mochi Embroidered Punjabi Ethnic Jutti',
      'Catwalk Comfortable Wedge Heel Party Slip-Ons',
      'Lavie Luxury Structured Vegan Leather Handbag',
      'Caprese Chic Multi-Pocket Shoulder Tote Bag',
      'Bata Comfit Ankle Strap Flat Sandals',
      'Baggit Vegan Leather Minimalist Crossbody Bag',
      'Carlton London Metallic Strap Evening Stilettos',
      'Zouk Vegan Leather Handcrafted Printed Laptop Tote'
    ],
    wFootwearImages,
    ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'Standard Bag Size'],
    ['Tan Brown', 'Blush Nude', 'Classic Black', 'Metallic Gold', 'Crimson Red'],
    999,
    ['Vintage Dreams', 'Lavie', 'Caprese', 'Mochi', 'Metro', 'Catwalk']
  );

  // 11. VINTAGE HERITAGE & ARCHIVE COLLECTION (52 products)
  const vintageImages = [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'
  ];

  createCategoryItems(
    'vintage-collection',
    'all',
    [
      '1990s Grunge Heavyweight Brushed Cotton Flannel Shirt',
      '1990s Baggy Stonewashed Relaxed Fit Denim Jeans',
      '1990s Retro Color-Block Windbreaker Athletic Jacket',
      '1990s Minimalist Silk Bias-Cut Party Slip Dress',
      '1990s Heavyweight Boxy Graphic Rock Band Tour Tee',
      '1990s Chunky Leather Lug-Sole Combat Boots',
      '1990s Clueless Plaid Pleated Mini Skirt & Cardigan Set',
      '1990s Vintage Gold-Tone Oval Rimless Sunglasses',
      '1990s Retro Sherpa-Lined Corduroy Trucker Jacket',
      '1950s Bomber Distressed Genuine Leather Flight Jacket',
      '1970s Retro Ribbed Corduroy Overshirt with Horn Buttons',
      'Heritage Herringbone Scottish Wool Tweed Tailored Blazer',
      '1980s Vintage Acid-Wash Classic Heavy Denim Trucker',
      'Victorian Antique Steampunk Hand-Engraved Roman Pocket Watch',
      '1960s Bohemian Prairie Floral Embroidered Swing Maxi Dress',
      'Victorian Heirloom 925 Solid Silver Filigree Signet Ring',
      '1970s Distressed Italian Suede High-Ankle Chelsea Boots',
      'Artisanal Hand-Tooled Vintage Saddle Leather Crossbody Bag',
      '1940s Retro Polka-Dot A-Line Tea Party Gown',
      'Art Deco 1930s Emerald Cut Vintage Solitaire Ring',
      'Vintage Royal Antique Gold Zari Brocade Wedding Saree'
    ],
    vintageImages,
    allSizes,
    ['Aged Tobacco Brown', 'Vintage Olive', 'Cognac Tan', 'Distressed Indigo', 'Antique Gold', 'Charcoal Heather', 'Stonewashed Blue'],
    1499,
    ['Vintage 90s Atelier', 'Heritage 1974', 'Retro Royale', 'Vintage Dreams']
  );

  return list;
};

const all500Products = generateProducts();

module.exports = {
  all500Products
};
