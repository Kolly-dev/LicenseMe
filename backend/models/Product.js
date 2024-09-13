const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	productName: {
		type: String,
		unique: true,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},

	productId: {
		type: String,
		unique: true,
		required: true,
	},

	duration: {
		type: Number,
		required: true,
	},

	renewalPeriod: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("product", ProductSchema);
