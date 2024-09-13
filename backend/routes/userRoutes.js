const express = require("express");
const router = express.Router();

const {
	registerUser,
	loginUser,
	verifyUser,
	forgotPassword,
	getUser,

	resetPassword,
	getUsers,
} = require("../controllers/userController");

const { check } = require("express-validator");

const {
	checkpassword,
	checkemail,
	checklastname,
	checkfirstname,
	checkconfirmpassword,
} = require("../middlewares/checks");
const auth = require("../middlewares/authMiddleware");

router.post(
	"/register",
	checkpassword,
	checkemail,
	checkfirstname,
	checklastname,
	checkconfirmpassword,
	registerUser
);

router.post("/login", checkpassword, checkemail, loginUser);

router.get("/getusers", getUsers);
router.get("/getuser", auth, getUser);

router.post(
	"/forgotpassword",
	check("email", "Please include a valid email")
		.isEmail()
		.notEmpty()
		.contains("@"),
	forgotPassword
);

router.get("/verifyuser/:id/:token", verifyUser);

router.post("/resetpassword", resetPassword);

module.exports = router;
