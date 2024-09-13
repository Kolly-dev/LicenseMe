const Product = require("../models/Product");
const Company = require("../models/CompanyProfile");
const License = require("../models/License");
const User = require("../models/User");
const Discount = require("../models/Discount");
const Commission = require("../models/Commission");
const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator");
const createLicense = async (req, res) => {
	try {
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// This is the id of the user that requested. This user will be an company admin

		const { email } = req.body;
		console.log(email);

		let parentCompany = await Company.findOne({ email });
		console.log(parentCompany);

		// if parent company is a distributor. Then check if disributor is accepted
		if (parentCompany.isDistributor) {
			if (!parentCompany.isAccepted) {
				return res.status(400).json({
					errors: [
						{
							msg: "This company is not accepted by Admin ",
						},
					],
				});
			}
		}

		let requesterUser;
		if (req.user.id) {
			let _id = req.user.id;
			requesterUser = await User.findOne({ _id });
		}

		let requestUserCompany;
		if (requesterUser) {
			let _id = requesterUser.companyProfile;
			requestUserCompany = await Company.findOne({ _id });
		}
		console.log(requestUserCompany);

		// check if requesting user company is a distributor
		if (requestUserCompany.isDistributor) {
			return res.status(400).json({
				errors: [
					{
						msg: "This company can't request because you are a distributor ",
					},
				],
			});
		}

		// check if the company that you are requesting from does exist
		if (!parentCompany) {
			return res
				.status(400)
				.json({ errors: [{ msg: "This company doesnt exist" }] });
		}

		// Company can't request license from itself
		if (email == requestUserCompany.email) {
			return res.status(400).json({
				errors: [{ msg: "Company can't request license from itself" }],
			});
		}

		//I want to find the first name and last name of the admin of the parent company
		// filter to find users linked to the parent company profile and isdmin
		// COME BACK TO THIS --- mongoose query manipulation to find and check if field exists
		const parentCompanyUser = await User.find({
			companyProfile: parentCompany._id,
			// companyIsAdmin: true,
		});

		//console.log(parentCompanyUser);

		if (!requesterUser.isCompanyLinked) {
			return res
				.status(400)
				.json({ errors: [{ msg: "User is not linked to a company" }] });
		}
		if (requestUserCompany.isLicenseRequested) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Company already has license requested" }] });
		}

		// find license of parent company

		let parentLicense;
		if (parentCompany && !parentCompany.isDistributor) {
			let companyProfile = parentCompany._id;
			parentLicense = await License.findOne({ companyProfile: companyProfile });

			if (
				!parentLicense?.status?.isActive ||
				parentLicense?.status?.isDeactivated
			) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Parent Company has no valid license" }] });
			}
		}

		const technician = await Product.findOne({ productId: 1 });
		const wine = await Product.findOne({ productId: 2 });
		//check if parent license is active

		//check if parent license is active

		// if (parentCompany.parentCompanyProfile) {
		// 	if (
		// 		!parentLicense.status.isActive ||
		// 		parentLicense.status.isDeactivated
		// 	) {
		// 		return res
		// 			.status(400)
		// 			.json({ errors: [{ msg: "Parent Company has no valid license" }] });
		// 	}
		// }

		const dat = Date.now();
		const licenseDetails = {
			companyProfile: requesterUser.companyProfile,
			parentCompanyProfile: parentCompany._id,
			companyName: requestUserCompany.name,
			companyEmail: requestUserCompany.email,
			parentCompanyName: parentCompany.name,
			parentCompanyEmail: parentCompany.email,
			userNames: `${requesterUser.firstName} ${requesterUser.lastName}`,
			// get user of parents from license
			parentCompanyUserNames:
				// function () {
				// 	if (parentCompanyUser.length != 0) {
				// 		return null;
				// 	} else {
				// 		return null;
				// 	}
				// },
				// parentCompanyUser
				`${parentCompanyUser[0]?.firstName} ${parentCompanyUser[0]?.lastName}`,
			// 	: null,
			// if parent license exist
			parentCompanyProfile2: parentLicense
				? parentLicense.parentCompanyProfile
				: parentCompany._id,

			// productName: parentLicense ? wine.productName : technician.productName,
			productName: parentLicense ? wine.productName : technician.productName,
			type: "New",
			group_name: parentLicense
				? parentLicense.group_name
				: parentCompany.group_name,

			requested_Date: dat,
		};

		// let newProduct = await Product.findOne({ productName });

		newLicenseRequest = new License(licenseDetails);
		newLicenseRequest.status.isRequested = true;
		// newLicenseRequest.requested_Date = new Date()
		// 	.toISOString()
		// 	.substring(0, 10);
		await newLicenseRequest.save();

		requestUserCompany.isLicenseRequested = true;
		await requestUserCompany.save();

		// res.json(newLicenseRequest);

		const parentCompany2 = await Company.findById({
			_id: licenseDetails.parentCompanyProfile2,
		});
		// send email to distributor

		// send email to user of requesting company that email has been accepted
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "mernomern@gmail.com",
				pass: "awkwehkdkqujrgqj",
			},
		});

		var mailOptions = {
			from: "mernomern@gmail.com",
			to: parentCompany2.email,
			subject: "License request",
			text: "Your application is requested",
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
		console.log(parentCompany2);

		res.json({
			userDetails: {
				user: requesterUser,
				companyProfileDetails: requestUserCompany,
				licenseDetails: newLicenseRequest,
			},
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

const getLicenses = async (req, res) => {
	try {
		const id = req.user.id;
		console.log(id);
		const user = await User.findById(id).select("-password");

		// get company
		let company;
		if (user.isCompanyLinked) {
			company = await Company.findOne({ _id: user.companyProfile });
		}

		// check if distributor and then get licenses by parent2
		if (company.isDistributor) {
			const licenses = await License.find({
				parentCompanyProfile2: company._id,
			});
			return res.json(licenses);
		}
		// check if technician and then get licenses by parent1
		if (company.role === "Technician") {
			const licenses = await License.find({
				parentCompanyProfile1: company._id,
			});
			return res.json(licenses);
		}

		// if user is app admin
		if (user.isAppAdmin) {
			const licenses = await License.find({});
			res.json(licenses);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

const acceptLicense = async (req, res) => {
	try {
		console.log(req.body);
		const { companyEmail, rateId, ref_number, parentCompanyEmail } = req.body;

		// find license details
		const licenseDetails = await License.findOne({
			companyEmail: companyEmail,
			status: { isRequested: true, isActive: false, isDeactivated: false },
		});

		console.log(licenseDetails);

		//find parent company name
		const parentCompany = await Company.findOne({ email: parentCompanyEmail });

		//find parent company user
		const parentUser = await User.findOne({
			companyProfile: parentCompany._id,
		});

		// find Rate
		const Rate = await Discount.findOne({ _id: rateId });

		// find parent2 commission
		const parentCommission = await Commission.findOne({
			companyProfileId: licenseDetails.parentCompanyProfile2,
		});
		console.log("Commission");
		console.log(parentCommission);
		// find the product
		const licenseProduct = await Product.findOne({
			productName: licenseDetails.productName,
		});
		const dat = new Date().getTime();

		// Update

		await License.findOneAndUpdate(
			{
				companyEmail: companyEmail,
				status: { isRequested: true, isActive: false, isDeactivated: false },
			},
			{
				rate: Rate.rate,
				status: { isRequested: false, isActive: true, isDeactivated: false },
				ref_number: ref_number,
				parentCompanyEmail: parentCompanyEmail,
				parentCompanyName: parentCompany.name,
				parentCompanyUserNames: `${parentUser.firstName} ${parentUser.lastName}`,
				commission:
					licenseProduct.productName === "Technician"
						? 0
						: parentCommission.amount,
				price: licenseProduct.price * ((100 - Rate.rate) / 100),
				expiry_Date: new Date(
					dat + licenseProduct.duration * 24 * 60 * 60 * 1000
				),
			}
		);
		// send email to user of requesting company that email has been accepted
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "mernomern@gmail.com",
				pass: "awkwehkdkqujrgqj",
			},
		});

		var mailOptions = {
			from: "mernomern@gmail.com",
			to: companyEmail,
			subject: "License request is Accepted",
			text: "Your application is accepted",
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});

		// update company role
		await Company.findOneAndUpdate(
			{
				email: companyEmail,
			},
			{ role: licenseDetails.productName }
		);

		// const UpdatedRequestCompany = await Company.findOne({
		// 	email: companyEmail,
		// });
		// console.log(UpdatedRequestCompany);

		// update Rate
		await Discount.findOneAndUpdate(
			{
				_id: rateId,
			},
			{ status: "Used" }
		);

		// find updated license

		const updateLicenseDetails = await License.findOne({
			companyEmail: companyEmail,
			status: { isRequested: false, isActive: true, isDeactivated: false },
		});

		res.json(updateLicenseDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

const rejectLicense = async (req, res) => {
	try {
		console.log(req.body);
		const { companyEmail } = req.body;

		// find license details
		const licenseDetails = await License.findOne({
			companyEmail: companyEmail,
			status: { isRequested: true, isActive: false, isDeactivated: false },
		});

		console.log(licenseDetails);

		await License.findOneAndUpdate(
			{
				companyEmail: companyEmail,
				status: { isRequested: true, isActive: false, isDeactivated: false },
			},
			{
				status: { isRequested: false, isActive: false, isDeactivated: true },
			}
		);

		// Update requester company isLicenseRequested -> false
		const requestUserCompany = await Company.findOne({ email: companyEmail });
		requestUserCompany.isLicenseRequested = false;
		await requestUserCompany.save();

		// send email to user of requesting company that email has been accepted
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "mernomern@gmail.com",
				pass: "awkwehkdkqujrgqj",
			},
		});

		var mailOptions = {
			from: "mernomern@gmail.com",
			to: companyEmail,
			subject: "License request is Reject",
			text: "Your application is rejected",
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});

		const updateLicenseDetails = await License.findOne({
			companyEmail: companyEmail,
			status: { isRequested: false, isActive: false, isDeactivated: true },
		});

		res.json(updateLicenseDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	createLicense,
	acceptLicense,
	getLicenses,
	rejectLicense,
};
