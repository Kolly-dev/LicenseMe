const Commission = require("../models/Commission");
const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const { validationResult } = require("express-validator");
const createCommission = async (req, res) => {
	try {
		console.log(req.body);
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const comp = req.body.companyProfileId;
		console.log(comp);
		const existingCommissions = await Commission.find({
			companyProfileId: comp,
		});

		console.log(existingCommissions);

		// companies shouldnt have 2 commissions for the same product
		let dulicates = [];

		existingCommissions.forEach((Commission) => {
			if (Commission.productId == req.body.productId) {
				dulicates.push(Commission);
			}
		});

		console.log(dulicates);
		// send error when duplicate commission is created per company
		if (dulicates.length > 0) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Commission for company already exists" }] });
		}
		// if company doesnt have an exisiting commission for a product then save new commission
		const newCommission = new Commission(req.body);
		await newCommission.save();
		return res.json(newCommission);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

const getCommissions = async (req, res) => {
	try {
		const id = req.user.id;
		console.log(id);
		const user = await User.findById(id).select("-password");

		// get company
		// let company;
		// if (user.isCompanyLinked) {
		// 	company = await CompanyProfile.findOne({ _id: user.companyProfile });
		// }

		// // check if distributor and then get commission by company profile
		// else if (company.isDistributor) {
		// 	const commission = await Commission.findOne({
		// 		companyProfileId: company._id,
		// 	});
		// 	res.json(commission);
		// }

		const commissions = await Commission.find({});
		res.json(commissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	createCommission,
	getCommissions,
};
