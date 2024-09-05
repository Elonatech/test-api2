const Product = require("../models/productModel");
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

const getProductById = async (req, res) => {
  const getId = await Product.findById(req.params.id);
  if (!getId) {
    return res.status(404).send({ message: "Product Not Found" });
  }
  const getProductById = await Product.findById(getId);
  return res.status(200).json({ getProductById });
};


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
    // Initialize filter criteria
    let filterCriteria = {};

    // Helper function to extract numbers and create a regex pattern
    const createNumberRegex = (value) => {
      if (!value) return;
      const cleanedValue = value.replace(/\D/g, ""); // Extract numeric part
      return new RegExp(`\\b${cleanedValue}\\b`, "i"); // Match the number as a whole word
    };

    // Helper function to clean up brand and price values
    const cleanUpValue = (value) => {
      if (!value) return;
      return value.replace(/\s+/g, "").replace(/,/g, "").toLowerCase(); // Remove spaces, commas, and lowercase
    };

    // Build the filter criteria based on query parameters
    if (req.query.ram) {
      filterCriteria["computerProperty.ram"] = {
        $regex: createNumberRegex(req.query.ram)
      };
    }
    if (req.query.drive) {
      filterCriteria["computerProperty.drive"] = {
        $regex: createNumberRegex(req.query.drive)
      };
    }
    if (req.query.brand) {
      filterCriteria["computerProperty.brand"] = {
        $regex: new RegExp(cleanUpValue(req.query.brand), "i") // Case-insensitive brand match
      };
    }
    if (req.query.price) {
      filterCriteria["computerProperty.price"] = {
        $regex: new RegExp(cleanUpValue(req.query.price)) // Match price after removing commas and spaces
      };
    }

    console.log("Filter Criteria:", filterCriteria); // Debugging line
    const products = await Product.find(filterCriteria);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




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

module.exports = {
  createProduct,
  getAllProducts,
  getProductsByFilter,
  getProductById,
  getComputers,
  deleteProduct,
  updateProduct,
  updateProductImage
};
