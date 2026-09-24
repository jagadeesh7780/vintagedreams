const Product = require('../models/Product');

// @desc   Get all products with search, filtering, sorting, and pagination
// @route  GET /api/products
// @access Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      gender,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 20,
      featured,
      trending
    } = req.query;

    const query = {};

    // Keyword Search (name, description, tags)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    // Category Filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Gender Filter
    if (gender && gender !== 'all') {
      query.gender = { $in: [gender, 'unisex'] };
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Featured / Trending
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (trending === 'true') {
      query.isTrending = true;
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popular') {
      sortOption = { numReviews: -1 };
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single product by ID
// @route  GET /api/products/:id
// @access Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc   Create a product (Admin)
// @route  POST /api/products
// @access Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct, message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a product (Admin)
// @route  PUT /api/products/:id
// @access Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({ success: true, product: updatedProduct, message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a product (Admin)
// @route  DELETE /api/products/:id
// @access Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc   Add review to product
// @route  POST /api/products/:id/reviews
// @access Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed by you' });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully', product });
  } catch (error) {
    next(error);
  }
};

// @desc   Get top rated / trending products
// @route  GET /api/products/top
// @access Public
exports.getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
