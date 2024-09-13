const mongoose = require("mongoose");

const LicenseSchema = new mongoose.Schema({
	rate: {
		type: Number,
	},
	companyProfile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},
	companyName: {
		type: String,
	},
	companyEmail: {
		type: String,
	},
	userNames: {
		type: String,
	},
	price: {
		type: String,
	},
	parentCompanyEmail: {
		type: String,
	},
	parentCompanyProfile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},
	parentCompanyName: {
		type: String,
	},

	parentCompanyUserNames: {
		type: String,
	},

	parentCompanyProfile1: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},
	parentCompanyProfile2: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},
	parentCompanyProfile3: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},
	commission: {
		type: Number,
	},
	productName: {
		type: String,
	},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "product",
	},
	group_name: {
		type: String,
	},
	type: { type: String },
	ref_number: {
		type: String,
	},

	status: {
		isRequested: { type: Boolean, default: false },
		isActive: { type: Boolean, default: false },
		isDeactivated: { type: Boolean, default: false },
	},
	requested_Date: {
		type: Date,
		// default: Date.now,
	},
	expiry_Date: {
		type: Date,
		// default: Date.now,
	},
});
module.exports = mongoose.model("license", LicenseSchema);
