const mongoose = require("mongoose");

const CommissionSchema = new mongoose.Schema({
	amount: {
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
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "product",
	},
	productName: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("commission", CommissionSchema);
