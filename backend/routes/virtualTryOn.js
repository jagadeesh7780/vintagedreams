const express = require('express');
const router = express.Router();
const {
  processVirtualTryOn,
  getTryOnRecommendations,
  resolveMapping
} = require('../controllers/virtualTryOnController');

// POST /api/virtual-tryon - Run AI Virtual Try-On inference pipeline
router.post('/', processVirtualTryOn);

// GET /api/virtual-tryon/recommendations - Get complementary outfit recommendations
router.get('/recommendations', getTryOnRecommendations);

// POST /api/virtual-tryon/mapping - Get automatic body region mapping and layering
router.post('/mapping', resolveMapping);

module.exports = router;
