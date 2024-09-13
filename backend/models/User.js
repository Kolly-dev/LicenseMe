const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	companyProfile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companyProfile",
	},

	isCompanyAdmin: {
		type: Boolean,
		default: false,
	},
	isAppAdmin: {
		type: Boolean,
		default: false,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isCompanyLinked: {
		type: Boolean,
		default: false,
	},
	avatar: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("user", UserSchema);
