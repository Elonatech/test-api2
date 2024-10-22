const sanitizeDescription = (description) => {
    return description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, '') // Remove HTML entities
      .substring(0, 155)       // Limit to 155 characters
      .trim();
  };
  
  const generateProductMetaTags = (product, baseUrl) => {
    const productUrl = `${baseUrl}/product/${product._id}`;
    const imageUrl = product.images?.[0]?.url || `${baseUrl}/default-product-image.jpg`;
    const description = sanitizeDescription(product.description);
  
    return {
      title: `${product.name} - Elonatech Nigeria Limited`,
      metaTags: [
        { property: 'og:title', content: product.name },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:url', content: productUrl },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: product.name },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl }
      ]
    };
  };
  
  module.exports = {
    sanitizeDescription,
    generateProductMetaTags
  };