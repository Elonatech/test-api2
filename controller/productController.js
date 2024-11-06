const Product = require("../models/productModel");
const RecentlyViewed = require("../models/recentlyViewesModel");
const generateMetaHtml = require('../utils/generateMetaHtml');


const cloudinary = require("../lib/cloudinary");

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      category,
      series,
      model,
      weight,
      dimension,
      item,
      color,
      hardware,
      os,
      processor,
      number,
      memory,
      ram,
      drive,
      display,
      resolution,
      graphics,
      voltage,
      battery,
      wireless
    } = req.body;
    let images = [...req.body.images];
    if (images.length === 0) {
      return res.status(400).send("Added Product Images");
    }
    let imagesBuffer = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products"
      });
      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    if (!name || !brand || !price || !odd || !category) {
      return res
        .status(400)
        .send("Please fill  Name, Brand, Price and Category fields");
    }

    const myRandomId = parseInt(Date.now() * Math.random());

    const data = {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      id: myRandomId,
      category,
      computerProperty: {
        series,
        model,
        weight,
        dimension,
        item,
        color,
        hardware,
        os,
        processor,
        number,
        memory,
        ram,
        drive,
        display,
        resolution,
        graphics,
        voltage,
        battery,
        wireless
      },
      images: imagesBuffer
    };
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  const getAllProducts = await Product.find();
  if (!getAllProducts) {
    return res.status(400).send("Bad request");
  }
  return res.status(200).json({ getAllProducts });
};

// const getProductById = async (req, res) => {
//   const getId = await Product.findById(req.params.id);
//   if (!getId) {
//     return res.status(404).send({ message: "Product Not Found" });
//   }
//   const getProductById = await Product.findById(getId);
//   return res.status(200).json({ getProductById });
// };


const getComputers = async (req, res) => {
  try {
    const products = await Product.find({ category: "Computer" });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};




const getProductsByFilter = async (req, res) => {
  try {
    let filterCriteria = { category: req.query.category || "Computer" };

    const cleanUpValue = (value) => {
      if (!value) return;
      return value.replace(/\s+/g, "").replace(/,/g, "").toLowerCase();
    };

    const createNumberRegex = (value) => {
      if (!value) return;
      const cleanedValue = value.replace(/\D/g, "");
      return new RegExp(`\\b${cleanedValue}\\b`, "i");
    };

    // Filter by RAM
    if (req.query.ram) {
      filterCriteria["computerProperty.ram"] = {
        $regex: createNumberRegex(req.query.ram)
      };
    }

    // Filter by Drive
    if (req.query.drive) {
      filterCriteria["computerProperty.drive"] = {
        $regex: createNumberRegex(req.query.drive)
      };
    }

    // Filter by multiple brands (case-insensitive)
    if (req.query.brand) {
      const brandArray = req.query.brand
        .split(",")
        .map((brand) => cleanUpValue(brand));
      filterCriteria["brand"] = {
        $in: brandArray.map((brand) => new RegExp(brand, "i")) // Case-insensitive match for each brand
      };
    }

    // Fetch products that match the brand, RAM, and drive criteria
    const products = await Product.find(filterCriteria);

    // Get all prices from the filtered products
    const prices = products
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    // Dynamic price range (if no range is provided)
    const dynamicMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const dynamicMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    let minPrice = parseFloat(req.query.minPrice) || dynamicMinPrice;
    let maxPrice = parseFloat(req.query.maxPrice) || dynamicMaxPrice;

    // Apply price filtering
    const filteredProducts = products.filter((product) => {
      const price = parseFloat(product.price);
      return price >= minPrice && price <= maxPrice;
    });

    // Get updated min and max price of the filtered products
    const filteredPrices = filteredProducts
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    const updatedMinPrice =
      filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
    const updatedMaxPrice =
      filteredPrices.length > 0 ? Math.max(...filteredPrices) : 0;

    res.status(200).json({
      success: true,
      data: filteredProducts,
      minPrice: updatedMinPrice,
      maxPrice: updatedMaxPrice
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllProductsByFilterForAllCategories = async (req, res) => {
  try {
    let filterCriteria = {}; // No category filter, so it applies to all products

    const cleanUpValue = (value) => {
      if (!value) return;
      return value.replace(/\s+/g, "").replace(/,/g, "").toLowerCase();
    };

    // Filter by multiple brands (case-insensitive)
    if (req.query.brand) {
      const brandArray = req.query.brand
        .split(",")
        .map((brand) => cleanUpValue(brand));
      filterCriteria["brand"] = {
        $in: brandArray.map((brand) => new RegExp(brand, "i")) // Case-insensitive match for each brand
      };
    }

    // Fetch products that match the brand criteria
    const products = await Product.find(filterCriteria);

    // Get all prices from the filtered products
    const prices = products
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    // Dynamic price range (if no range is provided)
    const dynamicMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const dynamicMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    let minPrice = parseFloat(req.query.minPrice) || dynamicMinPrice;
    let maxPrice = parseFloat(req.query.maxPrice) || dynamicMaxPrice;

    // Apply price filtering
    const filteredProducts = products.filter((product) => {
      const price = parseFloat(product.price);
      return price >= minPrice && price <= maxPrice;
    });

    // Get updated min and max price of the filtered products
    const filteredPrices = filteredProducts
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    const updatedMinPrice =
      filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
    const updatedMaxPrice =
      filteredPrices.length > 0 ? Math.max(...filteredPrices) : 0;

    res.status(200).json({
      success: true,
      data: filteredProducts,
      minPrice: updatedMinPrice,
      maxPrice: updatedMaxPrice
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Assuming this is part of your controller file

// Endpoint to fetch unique brands and min/max price range of all products
const getUniqueBrandsAndPriceRange = async (req, res) => {
  try {
    // Fetch all products to get unique brands and prices
    const products = await Product.find({});

    // Extract unique brands, normalizing to avoid duplicates caused by case and spaces
    const uniqueBrands = [
      ...new Set(products.map((product) => product.brand.trim().toLowerCase())),
    ];

    // Map the brands back to their original case-sensitive form
    const displayBrands = uniqueBrands.map((uniqueBrand) =>
      products.find(
        (product) => product.brand.trim().toLowerCase() === uniqueBrand
      ).brand
    );

    // Extract all prices from products, filtering valid numbers
    const prices = products.map((product) => parseFloat(product.price) || 0).filter(price => price > 0);

    // Calculate the min and max price from all products
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 1000000;

    res.status(200).json({
      success: true,
      brands: displayBrands,
      minPrice,
      maxPrice,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Endpoint to fetch filtered products based on brand and price range
// Endpoint to fetch filtered products based on multiple brands and price range





const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const myRandomId = parseInt(Date.now() * Math.random());

    const {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      category,
      series,
      model,
      weight,
      dimension,
      item,
      color,
      hardware,
      os,
      processor,
      number,
      memory,
      ram,
      drive,
      display,
      resolution,
      graphics,
      voltage,
      battery,
      wireless
    } = req.body;

    const data = {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      id: myRandomId,
      category,
      computerProperty: {
        series,
        model,
        weight,
        dimension,
        item,
        color,
        hardware,
        os,
        processor,
        number,
        memory,
        ram,
        drive,
        display,
        resolution,
        graphics,
        voltage,
        battery,
        wireless
      }
    };
    const newUpdateProduct = await Product.findByIdAndUpdate(product, data, {
      new: true
    });
    return res.status(200).json({ newUpdateProduct });
  } catch (error) {
    console.log(error);
  }
};

const updateProductImage = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    let images = [...req.body.images];
    if (images.length === 0) {
      return res.status(400).send("Added New Product Images");
    }

    let imagesBuffer = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products"
      });
      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    const data = {
      images: imagesBuffer
    };
    const newUpdateProduct = await Product.findByIdAndUpdate(product, data, {
      new: true
    });
    return res.status(200).json({ newUpdateProduct });
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Id not found");
    }
    await Product.findByIdAndDelete(product);
    return res.status(200).json({ message: "Blog Successfully Deleted" });
  } catch (error) {
    console.log(error);
  }
};

//Joseph's code

// const getProductById = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product Not Found" });
//     }

//     // Update recently viewed products
//     await updateRecentlyViewed(productId);

//     // Get the current count of recently viewed products
//     const recentlyViewed = await RecentlyViewed.findOne();
//     const recentlyViewedCount = recentlyViewed
//       ? recentlyViewed.products.length
//       : 0;

//     console.log(
//       `Current number of recently viewed products: ${recentlyViewedCount}`
//     );

//     return res.status(200).json({ product });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (req.isCrawler) {
      const html = generateMetaHtml(product);
      return res.send(html);
    }

    await updateRecentlyViewed(productId);

    const recentlyViewed = await RecentlyViewed.findOne();
    const recentlyViewedCount = recentlyViewed ? recentlyViewed.products.length : 0;

    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(5);

    res.status(200).json({ success: true, relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getRecentlyViewedProducts = async (req, res) => {
  try {
    const recentlyViewed = await RecentlyViewed.findOne().populate("products");

    if (!recentlyViewed) {
      return res.status(200).json({ recentlyViewedProducts: [] });
    }

    res.status(200).json({
      success: true,
      recentlyViewedProducts: recentlyViewed.products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




const updateRecentlyViewed = async (productId) => {
  try {
    const maxRecentlyViewed = 7; // Set the maximum number of recently viewed products

    // Find the existing document or create a new one if it doesn't exist
    let recentlyViewed = await RecentlyViewed.findOne();
    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({ products: [] });
    }

    // Remove the product if it already exists in the list
    recentlyViewed.products = recentlyViewed.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    // Add the new product to the beginning of the array
    recentlyViewed.products.unshift(productId);

    // Trim the array to keep only the last 'maxRecentlyViewed' products
    if (recentlyViewed.products.length > maxRecentlyViewed) {
      recentlyViewed.products = recentlyViewed.products.slice(
        0,
        maxRecentlyViewed
      );
    }

    // Save the updated document
    await recentlyViewed.save();

    console.log(
      `Current number of recently viewed products: ${recentlyViewed.products.length}`
    );
  } catch (error) {
    console.error("Error updating recently viewed products:", error);
  }
};



const getNextProduct = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Current product not found" });
    }

    const productCategory = currentProduct.category;

    const allProducts = await Product.find();

    const reversedProducts = allProducts.reverse();

    const categoryProducts = reversedProducts.filter(
      (product) => product.category === productCategory
    );

    const currentIndex = categoryProducts.findIndex(
      (product) => product._id.toString() === currentProduct._id.toString()
    );
    let nextProduct;
    if (currentIndex !== -1 && currentIndex < categoryProducts.length - 1) {
      nextProduct = categoryProducts[currentIndex + 1];
    } else {
      nextProduct = categoryProducts[0];
    }

    res.status(200).json({ nextProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  createProduct,
  getAllProducts,
  getProductsByFilter,
  getAllProductsByFilterForAllCategories,
  getUniqueBrandsAndPriceRange,
  getProductById,
  getComputers,
  updateRecentlyViewed,
  deleteProduct,
  updateProduct,
  updateProductImage,
  getRelatedProducts,
getRecentlyViewedProducts,
  getNextProduct
};
