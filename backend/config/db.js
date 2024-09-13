const env = require("dotenv").config();
const mongoose = require("mongoose");

const dbconnection = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log("DB is connected");
	} catch (err) {
		console.log(`ERROR: ${err.message}`);
	}
};

module.exports = dbconnection;