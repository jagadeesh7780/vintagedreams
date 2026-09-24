const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const { all500Products } = require('./generateCatalog');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('<username>')) {
      console.log('⚠️ MongoDB URI in .env not configured with actual credentials.');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Old products cleared.');

    // Insert 500+ generated products
    const inserted = await Product.insertMany(all500Products);
    console.log(`✅ ${inserted.length} products successfully seeded into MongoDB Atlas across all 10 Men & Women categories!`);

    // Reset default Admin & Customer accounts
    await User.deleteMany({ email: { $in: ['admin@vintagedreams.com', 'user@vintagedreams.com'] } });

    await User.create({
      name: 'Admin Vintage (Owner)',
      email: 'admin@vintagedreams.com',
      password: 'adminpassword123',
      phone: '9988776655',
      role: 'admin'
    });
    console.log('✅ Default Admin created: admin@vintagedreams.com / adminpassword123');

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
    console.log('✅ Default Customer created: user@vintagedreams.com / userpassword123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { all500Products };
