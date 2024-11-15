const mongoose = require('mongoose');
require('../models/productModel');
const Product = mongoose.model('Product');

function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     
    .replace(/[^\w\-]+/g, '')    
    .replace(/\-\-+/g, '-')      
    .replace(/^-+/, '')          
    .replace(/-+$/, '');        
}

async function generateUniqueSlug(name, existingId = null) {
  let slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;
  
  while (true) {
    const existingProduct = await Product.findOne({ 
      slug: uniqueSlug,
      _id: { $ne: existingId ? mongoose.Types.ObjectId(existingId) : null }
    });
    
    if (!existingProduct) {
      return uniqueSlug;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

const migrateProductSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const products = await Product.find({ slug: { $exists: false } });
    console.log(`Found ${products.length} products without slugs`);
    
    let counter = 0;
    for (const product of products) {
      product.slug = await generateUniqueSlug(product.name);
      await product.save();
      counter++;
      console.log(`[${counter}/${products.length}] Generated slug "${product.slug}" for product "${product.name}"`);
    }
    
    console.log('Slug migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

migrateProductSlugs();