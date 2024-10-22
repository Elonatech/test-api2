// backend/utils/metaTagsHelper.js
const sanitizeDescription = (description) => {
    return description
      .replace(/<[^>]*>/g, '')     // Remove HTML tags
      .replace(/&[^;]+;/g, '')     // Remove HTML entities
      .replace(/\s+/g, ' ')        // Normalize whitespace
      .replace(/[^\w\s-]/g, '')    // Remove special characters
      .substring(0, 155)           // Limit to 155 characters
      .trim();
  };
  
  const generateProductMetaTags = (product, baseUrl) => {
    const productUrl = `${baseUrl}/product/${product._id}`;
    const imageUrl = product.images?.[0]?.url || `${baseUrl}/default-product-image.jpg`;
    const description = sanitizeDescription(product.description);
    const price = Number(product.price).toLocaleString();
  
    return {
      title: `${product.name} - Elonatech Nigeria Limited`,
      metaTags: {
        // Basic Meta Tags
        description: description,
        
        // Open Graph Tags
        'og:title': product.name,
        'og:description': description,
        'og:image': imageUrl,
        'og:url': productUrl,
        'og:type': 'product',
        'og:site_name': 'Elonatech Nigeria Limited',
        'og:price:amount': price,
        'og:price:currency': 'NGN',
        
        // Twitter Card Tags
        'twitter:card': 'summary_large_image',
        'twitter:site': '@elonatech',
        'twitter:title': product.name,
        'twitter:description': description,
        'twitter:image': imageUrl,
        
        // Product Specific Tags
        'product:price:amount': price,
        'product:price:currency': 'NGN',
        'product:availability': product.quantity > 0 ? 'in stock' : 'out of stock'
      },
      
      // Schema.org JSON-LD
      jsonLd: {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        description: description,
        image: imageUrl,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'NGN',
          availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }
    };
  };
  
  module.exports = {
    sanitizeDescription,
    generateProductMetaTags
  };