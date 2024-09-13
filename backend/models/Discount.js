const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
	rate: {
		type: Number,
		required: true,
	},
	companyProfileId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},
	companyName: {
		type: String,
		required: true,
	},
	productName: {
		type: String,
		required: true,
	},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "product",
	},
	status: {
		type: String,
		default: "New",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("discount", DiscountSchema);
