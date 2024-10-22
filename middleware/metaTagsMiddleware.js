// backend/middleware/metaTagsMiddleware.js
const Product = require('../models/productModel');
const { sanitizeDescription, generateProductMetaTags } = require('../utils/metaTagsHelper');

const generateMetaTags = async (req, res, next) => {
  // Only process product routes
  if (!req.url.startsWith('/api/v1/product/')) {
    return next();
  }

  try {
    const productId = req.params.id;
    if (!productId) {
      return next();
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next();
    }

    // Get base URL from environment variables
    const baseUrl = process.env.FRONTEND_URL || 'https://elonatech-official-website.vercel.app';
    
    // Generate meta tags using helper
    const metaData = generateProductMetaTags(product, baseUrl);
    
    // Store in res.locals for access in route handler
    res.locals.metaTags = metaData;
    
    // Log for debugging
    console.log('Meta tags generated for product:', productId);
  } catch (error) {
    console.error('Meta tags generation error:', error);
    // Continue without meta tags rather than failing the request
  }
  next();
};

module.exports = generateMetaTags;