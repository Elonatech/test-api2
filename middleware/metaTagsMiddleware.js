const Product = require('../models/productModel'); // Adjust path as needed

const generateMetaTags = async (req, res, next) => {
  if (!req.url.startsWith('/api/v1/product/')) {
    return next();
  }

  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return next();
    }

    // Generate meta tags
    const metaTags = `
      <title>${product.name} - Elonatech Nigeria Limited</title>
      <meta name="description" content="${product.description.substring(0, 155)}">
      <meta property="og:title" content="${product.name}">
      <meta property="og:description" content="${product.description.substring(0, 155)}">
      <meta property="og:image" content="${product.images[0]?.url || ''}">
      <meta property="og:url" content="https://elonatech-official-website.vercel.app/product/${product._id}">
      <meta property="og:type" content="product">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${product.name}">
      <meta name="twitter:description" content="${product.description.substring(0, 155)}">
      <meta name="twitter:image" content="${product.images[0]?.url || ''}">
    `;

    res.locals.metaTags = metaTags;
    console.log(metaTags, "eyuuieieroirjfo")
  } catch (error) {
    console.error('Meta tags generation error:', error);
  }
  next();
};

module.exports = generateMetaTags