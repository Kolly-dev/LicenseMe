const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const createProduct = async (req, res) => {
	try {
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { price, productName, duration, productId, renewalPeriod } = req.body;
		console.log(req.body);

		let newProduct = await Product.findOne({ productName });

		if (newProduct) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Product already exists" }] });
		}
		newProduct = new Product(req.body);
		await newProduct.save();
		res.json(newProduct);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	createProduct,
	getProducts,
};
