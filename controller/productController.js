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

     // Helper function to create a regex pattern that ignores case and spaces
     const createRegex = (value) => {
       if (!value) return;
       // Remove spaces and ignore case
       const cleanedValue = value.replace(/\s+/g, "").toLowerCase();
       console.log("Creating regex for:", cleanedValue); // Debugging line
       return new RegExp(cleanedValue, "i");
     };

     // Build the filter criteria based on query parameters
     if (req.query.ram) {
       filterCriteria["computerProperty.ram"] = {
         $regex: createRegex(req.query.ram)
       };
     }
     if (req.query.price) {
       filterCriteria["computerProperty.price"] = {
         $regex: createRegex(req.query.price)
       };
     }
     if (req.query.brand) {
       filterCriteria["computerProperty.brand"] = {
         $regex: createRegex(req.query.brand)
       };
     }
     if (req.query.drive) {
       filterCriteria["computerProperty.drive"] = {
         $regex: createRegex(req.query.drive)
       };
     }

     console.log("Filter Criteria:", filterCriteria); // Debugging line
     const products = await Product.find(filterCriteria);
     res.status(200).json({ success: true, data: products });
   } catch (error) {
    console.error("error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
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
