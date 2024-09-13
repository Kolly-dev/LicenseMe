const express = require("express");
const router = express.Router();

const {
	createProduct,
	getProducts,
} = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");

router.post("/createproduct", auth, createProduct);
router.get("/getproducts", auth, getProducts);

module.exports = router;
