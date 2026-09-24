const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    default: 'Premium high-quality vintage and modern fashion wear crafted with the finest fabrics.'
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: function() {
      return Math.round(this.price * 1.4);
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['shirts', 'pants', 'shoes', 'watches', 'rings', 'women-dresses', 'women-tops', 'women-jewelry', 'women-sarees', 'women-footwear']
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    default: 'men'
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    default: ['S', 'M', 'L', 'XL']
  }],
  colors: [{
    type: String,
    default: ['Black', 'Blue', 'Navy', 'Brown']
  }],
  brand: {
    type: String,
    default: 'Vintage Dreams'
  },
  stock: {
    type: Number,
    default: 25,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 12
  },
  reviews: [reviewSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
