const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const License = require("../models/License");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// @route   POST api/users/register
// @desc    Register a user
// @access  Public

const registerUser = async (req, res) => {
	console.log(123);
	console.log(req.body);
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { firstName, lastName, email, password, confirmPassword } = req.body;

		let newUser = await User.findOne({ email });

		if (newUser) {
			return res.status(400).json({ errors: [{ msg: "User already exists" }] });
		}
		newUser = new User(req.body);

		//hash password
		const salt = await bcrypt.genSalt(10);
		newUser.password = await bcrypt.hash(password, salt);

		await newUser.save();
		const isCompanyLinked = newUser.isCompanyLinked;
		let _id = newUser._id;
		const payload = {
			user: {
				id: _id,
			},
		};

		var userToken;

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: 28800,
			},
			(err, token) => {
				if (err) throw err;
				// userToken = token;
				// console.log(userToken);

				const link = `http://localhost:3001/api/users/verifyuser/${_id}/${token}`;
				console.log(link);
				var transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: "mernomern@gmail.com",
						pass: "awkwehkdkqujrgqj",
					},
				});

				var mailOptions = {
					from: "mernomern@gmail.com",
					to: email,
					subject: "Please verify your account",
					// text: link,
					html: `  <html>
                    <head>
                        <meta charset="utf-8" />
                        <style>
                            body, * {
                                direction: ltr;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>You've signed up to use LicenseMe!</h1>
                        <h3>
                            Click this <a href=${link}>Link</a> to verify your account.
                        </h3>
                    <body>
                    </html>`,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log("Email sent: " + info.response);
					}
				});

				// res.json({ mytoken: token, isCompanyLinked: isCompanyLinked, isAppAdmin: isAppAdmin });
				res.json("Successful");
			}
		);
		console.log(userToken);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @route   GET api/users/verifyuser
// @desc    Login a user
// @access  Public

const verifyUser = async (req, res) => {
	console.log(req.params);
	const { id, token } = req.params;
	jwt.verify(token, process.env.JWT_SECRET, async (err) => {
		if (err) {
			return;
			res.status(401).send({ message: "Invalid Token" });
		}
	});

	try {
		let user = await User.findOne({ _id: id });
		// TD: verify token and check if user is token.user

		if (user.isVerified) {
			return res
				.status(400)
				.json([{ message: "User is already verified", type: "error" }]);
		}

		console.log(user);
		user.isVerified = true;
		await user.save();
		console.log(user);

		res.redirect("http://localhost:3000/login");
	} catch (err) {
		console.log(err);
	}
};

// @route   POST api/users/login
// @desc    Login a user
// @access  Public
const loginUser = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		console.log(req.body);

		let user = await User.findOne({ email });

		if (!user)
			return res
				.status(400)
				.json([{ message: "User does not exist", type: "error" }]);

		if (!user.isVerified) {
			return res
				.status(400)
				.json([{ message: "User is not verified", type: "error" }]);
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch)
			return res
				.status(400)
				.json([{ message: "Invalid credentials", type: "error" }]);

		const payload = {
			user: {
				id: user._id,
			},
		};
		const isCompanyLinked = user.isCompanyLinked;
		const isAppAdmin = user.isAppAdmin;

		let CompanyProfileDetails;
		if (isCompanyLinked) {
			let id = user.companyProfile;
			console.log(id);
			CompanyProfileDetails = await CompanyProfile.findById({ _id: id });
		}

		let UserLicenseDetails;
		if (CompanyProfileDetails?.isLicenseRequested) {
			UserLicenseDetails = await License.findOne({
				companyProfile: user.companyProfile,
				$or: [
					{
						status: {
							isRequested: true,
							isActive: false,
							isDeactivated: false,
						},
					},
					{
						status: {
							isRequested: false,
							isActive: true,
							isDeactivated: false,
						},
					},
				],
			});
		}

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: 28800,
			},
			(err, token) => {
				if (err) throw err;
				res.json({
					// mytoken: token,
					// userDetails: user,
					// companyProfileDetails: CompanyProfileDetails,
					// licenseDetails: UserLicenseDetails,

					mytoken: token,
					userDetails: {
						user: user,
						companyProfileDetails: CompanyProfileDetails,
						licenseDetails: UserLicenseDetails,
					},
				});
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private

const updateUser = async (req, res) => {
	try {
		const userId = req.params.id;

		if (userId !== req.user.id) {
			return res
				.status(401)
				.json([{ message: "Unauthorized Action", type: "error" }]);
		}

		let user = await User.findOneAndUpdate({ _id: userId }, req.body, {
			new: true,
		});

		if (!user)
			return res
				.status(404)
				.json([{ message: "User does not exist", type: "error" }]);

		res.json(user);
	} catch (err) {
		res.status(500).send("Server Error");
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.json(users);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @route   GET api/users/getuser
const getUser = async (req, res) => {
	try {
		console.log(req.body);
		const id = req.user.id;
		const user = await User.findById(id).select("-password");

		let CompanyProfileDetails;
		if (user.isCompanyLinked) {
			let id = user.companyProfile;
			console.log(id);
			CompanyProfileDetails = await CompanyProfile.findById({ _id: id });
		}

		let UserLicenseDetails;
		if (CompanyProfileDetails?.isLicenseRequested) {
			UserLicenseDetails = await License.findOne({
				companyProfile: user.companyProfile,
				$or: [
					{
						status: {
							isRequested: true,
							isActive: false,
							isDeactivated: false,
						},
					},
					{
						status: {
							isRequested: false,
							isActive: true,
							isDeactivated: false,
						},
					},
				],
			});
		}

		console.log(UserLicenseDetails);

		res.json({
			user: user,
			companyProfileDetails: CompanyProfileDetails,
			licenseDetails: UserLicenseDetails,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @route   GET api/users/forgotpassword

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array()[0].msg });
	}
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json([{ message: "user does not exist", type: "error" }]);
		}
		let _id = user._id;
		const payload = {
			user: {
				id: user.id,
			},
		};
		const secret = process.env.JWT_SECRET + user.password;
		const token = jwt.sign(payload, secret, {
			expiresIn: "5m",
		});
		const link = `http://localhost:3000/resetpassword/${_id}/${token}`;
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "mernomern@gmail.com",
				pass: "awkwehkdkqujrgqj",
			},
		});

		var mailOptions = {
			from: "mernomern@gmail.com",
			to: email,
			subject: "Password Reset",
			text: link,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
		res.send({ message: "We sent reset password link to your email." });
		console.log(link);
	} catch (error) {
		console.log(error);
		res.json({ status: "Something Went Wrong" });
	}
};

// const getPasswordReset = async (req, res) => {
// 	console.log(req.params);
// 	const { id, token } = req.params;
// 	try {
// 		if (token) {
// 			res.redirect("http://localhost:3000/resetpassword");
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

const resetPassword = async (req, res) => {
	const { password, id, token } = req.body;
	console.log(req.body);

	const user = await User.findOne({ _id: id });
	if (!user) {
		return res.json({ status: "User Not Exists!!" });
	}

	const secret = process.env.JWT_SECRET + user.password;
	console.log(secret);

	jwt.verify(token, secret, async (err, decode) => {
		if (err) {
			return;
			res.status(401).send({ message: "Invalid Token" });
		}
	});

	try {
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					password: encryptedPassword,
				},
			}
		);

		res.send({ message: "Password Updated" });
	} catch (err) {
		console.log(err);
		res.json({ status: "Something Went Wrong" });
	}
};

module.exports = {
	registerUser,
	getUsers,
	getUser,
	loginUser,
	verifyUser,
	updateUser,
	forgotPassword,
	resetPassword,
};
