const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	// Check token is available
	const token = req.header("x-auth-token");

	// console.log(token);

	if (!token)
		return res
			.status(401)
			.json([{ message: "No token, authorization denied", type: "error" }]);

	// Verify the token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded.user;

		// console.log(req.user);

		next();
	} catch (err) {
		res.status(401).json([{ message: "Token is not valid now", type: "error" }]);
	}
};
