const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.post("/create", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/computers", productController.getComputers);
router.get("/filter", productController.getProductsByFilter);
router.get("/:id", productController.getProductById);
router.put("/:id/update", productController.updateProduct);
router.put("/:id/update/image", productController.updateProductImage);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
