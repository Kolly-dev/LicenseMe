const Discount = require("../models/Discount");
const Company = require("../models/CompanyProfile");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const createDiscount = async (req, res) => {
	try {
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			rate,
			amount,
			companyProfileId,
			productId,
			companyName,
			productName,
		} = req.body;
		console.log(req.body);
		const newdiscounts = [];
		for (let i = 0; i < amount; i++) {
			const newDiscount = new Discount(req.body);
			await newDiscount.save();
			newdiscounts.push(newDiscount);
		}

		res.json(newdiscounts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

const getDiscounts = async (req, res) => {
	try {
		const id = req.user.id;
		console.log(id);
		const user = await User.findById(id).select("-password");

		// get company
		let company;
		if (user.isCompanyLinked) {
			company = await Company.findOne({ _id: user.companyProfile });
		}

		// check if distributor and then get disocunts by company profile

		if (company.isDistributor) {
			const discounts = await Discount.find({
				companyProfileId: company._id,
			});
			return res.json(discounts);
		}

		//everyone else
		const discounts = await Discount.find({});
		return res.json(discounts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	createDiscount,
	getDiscounts,
};
