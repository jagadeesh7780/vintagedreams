const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  // ===================== MEN'S SHIRTS =====================
  {
    name: 'Lymio Casual Shirt for Men Stylish Shirt',
    description: 'Casual stylish solid color shirt crafted from lightweight breathable cotton blend. Perfect for casual outings and daily wear.',
    price: 339,
    originalPrice: 999,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/81dszCJ0etL._SY879_.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Maroon', 'Navy', 'Olive', 'Black'],
    brand: 'Lymio',
    stock: 45,
    rating: 4.4,
    numReviews: 128,
    isFeatured: true,
    isTrending: true,
    tags: ['shirt', 'casual', 'men', 'cotton', 'lymio']
  },
  {
    name: 'The Souled Store Plaid Imperial Blue Men Utility Shirts',
    description: 'Relaxed fit utility shirt featuring check pattern, twin chest pockets, and durable button-up closure.',
    price: 999,
    originalPrice: 1999,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71IU11W8asL._SY741_.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Imperial Blue', 'Charcoal Grey'],
    brand: 'The Souled Store',
    stock: 30,
    rating: 4.6,
    numReviews: 95,
    isFeatured: true,
    isTrending: false,
    tags: ['shirt', 'plaid', 'utility', 'the souled store', 'blue']
  },
  {
    name: 'The Souled Store Solids Faded Green Cotton Relaxed Shirts',
    description: 'Effortlessly cool faded green cotton shirt with relaxed fit, spread collar, and curved hemline.',
    price: 1499,
    originalPrice: 2499,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/611SbasaFRL._SY741_.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Faded Green', 'Sage'],
    brand: 'The Souled Store',
    stock: 22,
    rating: 4.5,
    numReviews: 64,
    isFeatured: false,
    isTrending: true,
    tags: ['shirt', 'relaxed', 'green', 'cotton']
  },
  {
    name: "Arrow Men's Premium Formal Shirt",
    description: 'Executive class formal dress shirt engineered with wrinkle-resistant yarn and reinforced cutaway collar.',
    price: 899,
    originalPrice: 1899,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/61rRjFn9FJL._AC_UL480_QL65_.jpg'],
    sizes: ['38', '40', '42', '44'],
    colors: ['Crisp White', 'Sky Blue', 'Light Pink'],
    brand: 'Arrow',
    stock: 50,
    rating: 4.7,
    numReviews: 210,
    isFeatured: true,
    isTrending: false,
    tags: ['formal', 'shirt', 'arrow', 'office', 'premium']
  },
  {
    name: 'Lymio Casual Shirt for Men Stylish Rib Shirt',
    description: 'Unique ribbed texture stretch-fit shirt giving a modern, elevated silhouette for evening gatherings.',
    price: 479,
    originalPrice: 1299,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71V5gEc8YVL._SY879_.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Off-White', 'Wine'],
    brand: 'Lymio',
    stock: 35,
    rating: 4.3,
    numReviews: 88,
    isFeatured: false,
    isTrending: true,
    tags: ['ribbed', 'shirt', 'stylish', 'partywear']
  },
  {
    name: 'Lymio Men T-Shirt Plain Polo Shirt',
    description: 'Classic pique cotton polo t-shirt with ribbed collar, 3-button placket, and side-slit hem.',
    price: 379,
    originalPrice: 999,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71x4rLhMkML._SY879_.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue', 'Mustard', 'White'],
    brand: 'Lymio',
    stock: 60,
    rating: 4.2,
    numReviews: 140,
    isFeatured: false,
    isTrending: false,
    tags: ['polo', 't-shirt', 'casual', 'cotton']
  },
  {
    name: 'OTUS Casual Shirt for Men Striped Printed Shirt',
    description: 'Vertical striped urban casual shirt with button-down collar and soft-washed cotton fabric.',
    price: 398,
    originalPrice: 1099,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/51Txwy6l6CL.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black Stripe', 'Navy Stripe'],
    brand: 'OTUS',
    stock: 40,
    rating: 4.1,
    numReviews: 53,
    isFeatured: false,
    isTrending: false,
    tags: ['striped', 'shirt', 'otus', 'casual']
  },
  {
    name: "Symbol Men's Solid Slim Regular Fit Formal Shirt",
    description: 'Precision tailored formal shirt featuring clean lines, premium cotton fabric, and subtle luster.',
    price: 499,
    originalPrice: 1399,
    category: 'shirts',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71BwxuB0p-L._SY879_.jpg'],
    sizes: ['39', '40', '42', '44'],
    colors: ['Navy', 'Black', 'Steel Grey'],
    brand: 'Symbol',
    stock: 48,
    rating: 4.4,
    numReviews: 178,
    isFeatured: false,
    isTrending: false,
    tags: ['formal', 'symbol', 'slim fit', 'office']
  },

  // ===================== MEN'S PANTS & CARGOS =====================
  {
    name: 'The Souled Store Solids Brown Regular Fit Cotton Cargo Jeans',
    description: 'Heavyweight cotton cargo pants with 6 utility pockets, relaxed leg opening, and durable zip-fly.',
    price: 1499,
    originalPrice: 2999,
    category: 'pants',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/61wd080+AxL._SY741_.jpg'],
    sizes: ['30', '32', '34', '36'],
    colors: ['Khaki Brown', 'Olive Green', 'Jet Black'],
    brand: 'The Souled Store',
    stock: 35,
    rating: 4.7,
    numReviews: 112,
    isFeatured: true,
    isTrending: true,
    tags: ['cargo', 'pants', 'jeans', 'the souled store', 'brown']
  },
  {
    name: 'Lymio Track Pant for Men Plain Track Pant',
    description: 'Ultra-stretch comfortable athletic joggers with moisture-wicking fleece fabric and elastic drawstring waistband.',
    price: 479,
    originalPrice: 1199,
    category: 'pants',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/610IIi6wHuL._SY879_.jpg'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Dark Grey', 'Black', 'Navy'],
    brand: 'Lymio',
    stock: 55,
    rating: 4.3,
    numReviews: 92,
    isFeatured: false,
    isTrending: false,
    tags: ['track pant', 'joggers', 'gym', 'lymio']
  },
  {
    name: 'Lymio Men Cargo Pants Cotton Cargos for Men',
    description: 'Multi-pocket tactical street cargo pants designed with reinforced knee panels and gusseted construction.',
    price: 598,
    originalPrice: 1599,
    category: 'pants',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/61j9jJhrStL._SY879_.jpg'],
    sizes: ['30', '32', '34', '36'],
    colors: ['Camo Green', 'Black', 'Beige'],
    brand: 'Lymio',
    stock: 42,
    rating: 4.4,
    numReviews: 76,
    isFeatured: true,
    isTrending: true,
    tags: ['cargo', 'pants', 'streetwear', 'tactical']
  },

  // ===================== MEN'S SHOES =====================
  {
    name: "U.S. POLO ASSN. Men's Premium Sneaker",
    description: 'Iconic athletic lifestyle sneakers with memory foam insole, synthetic leather upper, and anti-slip rubber outsole.',
    price: 1499,
    originalPrice: 3499,
    category: 'shoes',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71aFuiEntML._SY695_.jpg'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['White/Navy', 'Triple White', 'Black'],
    brand: 'U.S. POLO ASSN.',
    stock: 28,
    rating: 4.8,
    numReviews: 320,
    isFeatured: true,
    isTrending: true,
    tags: ['shoes', 'sneakers', 'us polo', 'footwear', 'white sneakers']
  },
  {
    name: "U.S. POLO ASSN. Men's Canvas Sneaker",
    description: 'Casual lace-up canvas shoes with vulcanized rubber sole and breathable canvas upper for all-day comfort.',
    price: 1649,
    originalPrice: 3299,
    category: 'shoes',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/61I0AJDKA0S._SY695_.jpg'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Navy Blue', 'Grey'],
    brand: 'U.S. POLO ASSN.',
    stock: 20,
    rating: 4.5,
    numReviews: 89,
    isFeatured: false,
    isTrending: false,
    tags: ['canvas', 'shoes', 'sneakers', 'us polo']
  },
  {
    name: "U.S. POLO ASSN. Men's Casual Canvas Sneaker",
    description: 'Retro low-top trainers featuring signature contrast logo branding, padded collar, and cushioned midsole.',
    price: 1649,
    originalPrice: 3299,
    category: 'shoes',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71OPYKJ4nuL._SX695_.jpg'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Olive Green', 'Khaki'],
    brand: 'U.S. POLO ASSN.',
    stock: 24,
    rating: 4.6,
    numReviews: 110,
    isFeatured: false,
    isTrending: true,
    tags: ['shoes', 'casual', 'low top', 'footwear']
  },

  // ===================== WATCHES =====================
  {
    name: 'LOUIS DEVIN Leather Strap Analog Wrist Watch for Men',
    description: 'Luxurious minimalist timepiece featuring genuine leather strap, water resistance, and Japanese quartz movement.',
    price: 284,
    originalPrice: 1599,
    category: 'watches',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/81kLhCWFSjL._SX679_.jpg'],
    sizes: ['Free Size'],
    colors: ['Brown Strap / Black Dial', 'Black Strap / Gold Dial'],
    brand: 'LOUIS DEVIN',
    stock: 80,
    rating: 4.2,
    numReviews: 540,
    isFeatured: true,
    isTrending: true,
    tags: ['watch', 'analog', 'leather', 'accessories', 'luxury']
  },
  {
    name: 'Matrix Antique Day Date Leather Strap Analog Watch',
    description: 'Vintage styled watch with day & date calendar sub-dials, roman numerals, and antique copper finish case.',
    price: 289,
    originalPrice: 1999,
    category: 'watches',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/71AjeVD1bPL._SX679_.jpg'],
    sizes: ['Free Size'],
    colors: ['Antique Tan', 'Dark Brown'],
    brand: 'Matrix',
    stock: 65,
    rating: 4.3,
    numReviews: 310,
    isFeatured: true,
    isTrending: false,
    tags: ['watch', 'antique', 'vintage', 'day date']
  },
  {
    name: 'Matrix Antique 2.0 Day Date Silicone Strap Analog Watch',
    description: 'Sporty hybrid vintage watch with durable matte black silicone strap and rugged dual-tone bezel.',
    price: 289,
    originalPrice: 1899,
    category: 'watches',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/711NXCmUfbL._SX679_.jpg'],
    sizes: ['Free Size'],
    colors: ['Matte Black', 'Navy Blue'],
    brand: 'Matrix',
    stock: 50,
    rating: 4.1,
    numReviews: 195,
    isFeatured: false,
    isTrending: true,
    tags: ['watch', 'silicone', 'sport', 'matrix']
  },

  // ===================== MEN'S RINGS & ACCESSORIES =====================
  {
    name: 'GIVA 925 Silver Classic Ring Band for Men',
    description: 'Hallmarked 925 Pure Sterling Silver minimal band with rhodium polish for long-lasting shine and tarnish protection.',
    price: 2991,
    originalPrice: 4999,
    category: 'rings',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/511QHTo6j3L._SY625_.jpg'],
    sizes: ['16', '18', '20', '22'],
    colors: ['Silver Polish'],
    brand: 'GIVA',
    stock: 30,
    rating: 4.9,
    numReviews: 240,
    isFeatured: true,
    isTrending: true,
    tags: ['ring', 'silver', 'giva', '925 silver', 'luxury', 'jewelry']
  },
  {
    name: 'Clara Pure 925 Sterling Silver Oxidised Cross Men Ring',
    description: 'Statement gothic cross carved ring with oxidized black patina finish and solid sterling silver weight.',
    price: 1637,
    originalPrice: 2999,
    category: 'rings',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/519HMAUTrQL._SY625_.jpg'],
    sizes: ['17', '19', '21'],
    colors: ['Oxidized Silver'],
    brand: 'Clara',
    stock: 25,
    rating: 4.6,
    numReviews: 87,
    isFeatured: false,
    isTrending: false,
    tags: ['ring', 'oxidised', 'cross', 'clara', 'silver']
  },
  {
    name: 'Clara Pure 925 Sterling Silver Infinity Men Ring Platinum Plated',
    description: 'Infinity loop motif masculine band plated with real platinum for ultra-durability and supreme sparkle.',
    price: 1819,
    originalPrice: 3499,
    category: 'rings',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/41UfkhGo3eL._SY695_.jpg'],
    sizes: ['18', '20', '22'],
    colors: ['Platinum Silver'],
    brand: 'Clara',
    stock: 28,
    rating: 4.7,
    numReviews: 62,
    isFeatured: false,
    isTrending: true,
    tags: ['ring', 'infinity', 'platinum', 'silver']
  },
  {
    name: 'ZAVYA Solid CZ Studded 925 Pure Silver Ring For Men',
    description: 'Contemporary signet style silver ring embedded with AAA cubic zirconia solitaires for an opulent appearance.',
    price: 979,
    originalPrice: 2199,
    category: 'rings',
    gender: 'men',
    images: ['https://m.media-amazon.com/images/I/61ahdD6ANdL._SY625_.jpg'],
    sizes: ['16', '18', '20'],
    colors: ['Sparkle Silver'],
    brand: 'ZAVYA',
    stock: 35,
    rating: 4.5,
    numReviews: 145,
    isFeatured: true,
    isTrending: false,
    tags: ['ring', 'cz', 'zavya', 'studded', 'silver']
  },

  // ===================== WOMEN'S FASHION (DRESSES, TOPS, JEWELRY, SAREES) =====================
  {
    name: 'Vintage Dreams Floral Printed A-Line Midi Dress',
    description: 'Chic boho-chic floral midi dress with sweetheart neckline, puff sleeves, and flowy tiered flare.',
    price: 899,
    originalPrice: 2199,
    category: 'women-dresses',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Pink', 'Sky Floral', 'Emerald Green'],
    brand: 'Vintage Dreams',
    stock: 40,
    rating: 4.8,
    numReviews: 180,
    isFeatured: true,
    isTrending: true,
    tags: ['dress', 'women', 'floral', 'midi dress', 'summer']
  },
  {
    name: 'Vintage Elegance Satin Wrap Evening Gown',
    description: 'Glossy premium satin wrap maxi dress with V-neckline, self-tie sash, and dramatic side slit.',
    price: 1899,
    originalPrice: 3999,
    category: 'women-dresses',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L'],
    colors: ['Burgundy Wine', 'Midnight Navy', 'Emerald'],
    brand: 'Vintage Dreams',
    stock: 25,
    rating: 4.9,
    numReviews: 95,
    isFeatured: true,
    isTrending: true,
    tags: ['gown', 'satin', 'evening', 'partywear', 'women']
  },
  {
    name: 'Embroidered Chikankari Pure Cotton Kurti & Pant Set',
    description: 'Artisanal hand-embroidered Lucknowi Chikankari tunic with matching straight trousers and chiffon dupatta.',
    price: 1299,
    originalPrice: 2899,
    category: 'women-tops',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Pastel Peach', 'Mint Green', 'Powder Blue'],
    brand: 'Vintage Dreams',
    stock: 50,
    rating: 4.7,
    numReviews: 215,
    isFeatured: true,
    isTrending: false,
    tags: ['kurti', 'ethnic', 'chikankari', 'cotton', 'women']
  },
  {
    name: 'Modern Vintage Crop Shirt with Puff Sleeves',
    description: 'Crisp cropped cotton shirt featuring vintage exaggerated collar and mother-of-pearl buttons.',
    price: 549,
    originalPrice: 1299,
    category: 'women-tops',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pure White', 'Stripe Blue', 'Beige'],
    brand: 'Vintage Dreams',
    stock: 35,
    rating: 4.4,
    numReviews: 70,
    isFeatured: false,
    isTrending: true,
    tags: ['crop top', 'shirt', 'vintage', 'women']
  },
  {
    name: 'GIVA 925 Sterling Silver Rose Gold Plated Heart Necklace',
    description: 'Dainty heart pendant adorned with shimmering zircon stones on an adjustable 18-inch rose gold chain.',
    price: 1999,
    originalPrice: 3999,
    category: 'women-jewelry',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Adjustable'],
    colors: ['Rose Gold', 'Silver Platinum'],
    brand: 'GIVA',
    stock: 45,
    rating: 4.9,
    numReviews: 420,
    isFeatured: true,
    isTrending: true,
    tags: ['necklace', 'jewelry', 'giva', 'rose gold', 'heart pendant']
  },
  {
    name: 'Royal Heritage Kanjivaram Silk Zari Border Saree',
    description: 'Luxurious woven pure art silk saree with ornate temple golden zari border and rich designer pallu.',
    price: 2499,
    originalPrice: 5999,
    category: 'women-sarees',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['Royal Maroon Gold', 'Peacock Green Gold', 'Mustard Yellow'],
    brand: 'Vintage Dreams',
    stock: 30,
    rating: 4.8,
    numReviews: 160,
    isFeatured: true,
    isTrending: true,
    tags: ['saree', 'kanjivaram', 'silk', 'ethnic', 'wedding']
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('<username>')) {
      console.log('⚠️ MongoDB URI in .env not configured with actual credentials.');
      console.log('💡 You can run seeding anytime once your Atlas URI is set.');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Old products cleared.');

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products successfully seeded into MongoDB Atlas!`);

    // Create default Admin User
    await User.deleteMany({ email: { $in: ['admin@vintagedreams.com', 'user@vintagedreams.com'] } });
    
    await User.create({
      name: 'Admin Vintage',
      email: 'admin@vintagedreams.com',
      password: 'adminpassword123',
      phone: '9988776655',
      role: 'admin'
    });
    console.log('✅ Default Admin created: admin@vintagedreams.com / adminpassword123');

    // Create default Customer User
    await User.create({
      name: 'Jagadeesh',
      email: 'user@vintagedreams.com',
      password: 'userpassword123',
      phone: '7780597718',
      role: 'user',
      addresses: [{
        street: '123 Vintage Boulevard, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        phone: '7780597718',
        isDefault: true
      }]
    });
    console.log('✅ Default Customer created: user@vintagedreams.com / userpassword123 (Phone: 7780597718)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { products };
