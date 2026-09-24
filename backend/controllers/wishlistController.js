const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc   Get user wishlist
// @route  GET /api/wishlist
// @access Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Add item to wishlist
// @route  POST /api/wishlist
// @access Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const alreadyExists = wishlist.items.some(
      item => item.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ success: false, message: 'Product is already in wishlist' });
    }

    wishlist.items.push({
      product: productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category
    });

    await wishlist.save();
    wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Remove item from wishlist
// @route  DELETE /api/wishlist/:productId
// @access Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId && item._id.toString() !== productId
    );

    await wishlist.save();
    wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};
