const mongoose = require("mongoose");

const CompanyProfileSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	avatar: {
		type: String,
	},
	contact_name: {
		type: String,
	},
	erp_code: {
		type: String,
	},
	telephone: {
		type: String,
	},
	role: {
		type: String,
	},
	isLicenseRequested: {
		type: Boolean,
		default: false,
	},

	isDistributor: {
		type: Boolean,
		default: false,
	},
	isAccepted: {
		type: Boolean,
		default: false,
	},
	group_name: {
		type: String,
	},
	// users: [
	// 	{
	// 		user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	// 		isCompanyAdmin: {
	// 			type: Boolean,
	// 		},
	// 	},
	// ],
	// parent: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "companyProfile",
	// },
	// ancestors: [
	// 	{
	// 		CompanyProfile: {
	// 			type: mongoose.Schema.Types.ObjectId,
	// 			ref: "companyProfile",
	// 		},
	// 	},
	// ],
	// children: [
	// 	{
	// 		CompanyProfile: {
	// 			type: mongoose.Schema.Types.ObjectId,
	// 			ref: "companyProfile",
	// 		},
	// 	},
	// ],
	commission: {
		type: Number,
	},
});

module.exports = mongoose.model("companyProfile", CompanyProfileSchema);
