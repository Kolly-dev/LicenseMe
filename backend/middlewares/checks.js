const { check } = require("express-validator");

const checkfirstname = check("firstName", "First Name is required").notEmpty();
const checklastname = check("lastName", "Last Name is required").notEmpty();
const checkemail = check("email", "Please include a valid email").isEmail();
// .notEmpty()
// .contains("@");
const checkpassword = check(
	"password",
	"Please enter a password with 6 or more characters"
).isLength({ min: 6 });
const checkconfirmpassword = check(
	"confirmPassword",
	"Please enter a password with 6 or more characters"
)
	.isLength({ min: 6 })
	.custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation does not match password");
		}
		return true;
	});

module.exports = {
	checkfirstname,
	checklastname,
	checkemail,
	checkpassword,
	checkconfirmpassword,
};
