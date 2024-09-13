const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const License = require("../models/License");
const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator");

// @route   POST api/users/createcompanyprofile
// @desc    create company profile
// @access  Private

const createCompanyProfile = async (req, res) => {
	try {
		console.log(req.body);
		const id = req.user.id;
		const user = await User.findById(id).select("-password");

		if (user.isAppAdmin) {
			const newCompany = new CompanyProfile(req.body);
			await newCompany.save();
			res.json(newCompany);
		}

		if (!user.isAppAdmin) {
			if (user.isCompanyLinked) {
				return res
					.status(400)
					.json([
						{ message: "User already is linked to a company", type: "error" },
					]);
			}

			//creating a company profile
			const { name, email, telephone, isDistributor } = req.body;
			const companyProfile = await CompanyProfile.findOne({ email: email });
			if (companyProfile) {
				return res
					.status(400)
					.json([{ message: "Comapny email already exists", type: "error" }]);
			}

			if (!email) {
				return res
					.status(400)
					.json([{ message: "Comapny email is required", type: "error" }]);
			}

			if (!name) {
				return res
					.status(400)
					.json([{ message: "Comapny name is required", type: "error" }]);
			}

			newCompany = new CompanyProfile(req.body);
			await newCompany.save();
			// res.json(newCompany);

			let comp = await CompanyProfile.findOne({ email: email });
			console.log(comp);

			// link user to company by updating user

			await User.findOneAndUpdate(
				{
					_id: id,
				},
				{
					companyProfile: comp._id,
					isCompanyLinked: true,
				}
			);

			const updatedUser = await User.findById(id).select("-password");

			// find license details

			let UserLicenseDetails;
			if (comp?.isLicenseRequested) {
				UserLicenseDetails = await License.findOne({
					companyProfile: user.companyProfile,
				});
			}
			// find admin user
			const adminUser = await User.findOne({ isAppAdmin: true });

			var transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: "mernomern@gmail.com",
					pass: "awkwehkdkqujrgqj",
				},
			});
			if (isDistributor) {
				var mailOptions = {
					from: "mernomern@gmail.com",
					to: adminUser.email,
					subject: "Please verify this Distributor account",
					text: `${name} is a new distributor. Please confirm`,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log("Email sent: " + info.response);
					}
				});
			}

			res.json({
				userDetails: {
					user: updatedUser,
					companyProfileDetails: comp,
					licenseDetails: UserLicenseDetails,
				},
			});
		}
	} catch (error) {
		console.log(error);
		res.json({ status: "Something Went Wrong" });
	}
};

const getCompanyProfile = async (req, res) => {
	try {
		console.log("i came here");
		const id = req.user.id;
		console.log(id);
		const user = await User.findById(id).select("-password");
		let userCompanyId = user.companyProfile;
		if (!userCompanyId) {
			return res
				.status(400)
				.json([{ message: "User is not linked to a company", type: "error" }]);
		}
		const userCompany = await CompanyProfile.findById(userCompanyId);
		res.json(userCompany);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

const getCompanyProfiles = async (req, res) => {
	try {
		const companyProfiles = await CompanyProfile.find({});
		res.json(companyProfiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// accept distributor
const acceptDistributor = async (req, res) => {
	try {
		console.log(req.body);
		const { email, name, group_name, erp_code, contact_name } = req.body;

		await CompanyProfile.findOneAndUpdate(
			{
				email: email,
			},
			{
				name: name,
				isAccepted: true,
				group_name: group_name,
				erp_code: erp_code,
				contact_name: contact_name,
			}
		);
		const company = await CompanyProfile.findOne({ email: email });

		const companyUser = await User.findOne({ companyProfile: company._id });

		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "mernomern@gmail.com",
				pass: "awkwehkdkqujrgqj",
			},
		});

		var mailOptions = {
			from: "mernomern@gmail.com",
			to: companyUser?.email,
			subject: "Distributor Accepted",
			text: "Your application is accepted",
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
		return res.status(200).json([{ message: "Distributor Company accepted" }]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// get distributors
const getDistributors = async (req, res) => {
	try {
		//Add && condition for not accepted distributors
		const distributors = await CompanyProfile.find({ isDistributor: true });
		if (distributors.length === 0) {
			return res.status(200).json([{ message: "No new distributors" }]);
		}
		let newDistributors = [];
		for (let i = 0; i < distributors.length; i++) {
			const CompanyUser = await User.findOne({
				companyProfile: distributors[i]._id,
			});
			const distributorObj = {
				companyName: distributors[i].name,
				companyEmail: distributors[i].email,
				isAccepted: distributors[i].isAccepted,
				companyErp: distributors[i].erp_code,
				companyContactName: distributors[i].contact_name,
				CompanyUser: CompanyUser
					? `${CompanyUser?.firstName} ${CompanyUser?.lastName}`
					: "Not Available",
				// `${CompanyUser?.firstName}  ${CompanyUser?.lastName}`,
			};

			newDistributors.push(distributorObj);
		}

		res.json(newDistributors);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// reject distributor
const deleteCompany = async (req, res) => {
	try {
		console.log("i came here tooo");
		const { email } = req.body;
		console.log(email);

		//find company
		const company = await CompanyProfile.findOne({ email: email });

		if (!company) {
			return res
				.status(400)
				.json([{ message: "No company found", type: "error" }]);
		}
		// find user linked to company
		if (company && company.isDistributor) {
			const companyUser = await User.findOne({ companyProfile: company._id });
			var transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: "mernomern@gmail.com",
					pass: "awkwehkdkqujrgqj",
				},
			});

			var mailOptions = {
				from: "mernomern@gmail.com",
				to: companyUser?.email,
				subject: "Rejected Distributor",
				text: "Your application is rejected",
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log("Email sent: " + info.response);
				}
			});

			await company.deleteOne({ email: company?.email });
			return res.status(200).json([{ message: "Distributor Company deleted" }]);
		}

		if (company && !company.isDistributor) {
			await company.deleteOne({ email: company?.email });
			return res.status(200).json([{ message: "Company deleted" }]);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
// const getProfile = async (req, res) => {
// 	try {
// 		const user = await User.findById(req.user.id)
// 			.select("-password")
// 			.select("-__v");

// 		if (!user)
// 			return res
// 				.status(404)
// 				.json([{ message: "User does not exist", type: "error" }]);

// 		res.json(user);
// 	} catch (error) {
// 		console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
// 		res.status(500).send("Server Error");
// 	}
// };

module.exports = {
	createCompanyProfile,
	getCompanyProfile,
	getCompanyProfiles,
	getDistributors,
	deleteCompany,
	acceptDistributor,
};
