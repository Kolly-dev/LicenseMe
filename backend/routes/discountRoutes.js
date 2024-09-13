const express = require("express");
const router = express.Router();

const {
	createDiscount,
	getDiscounts,
} = require("../controllers/discountController");
const auth = require("../middlewares/authMiddleware");

router.post("/creatediscount", auth, createDiscount);
router.get("/getdiscounts", auth, getDiscounts);

module.exports = router;
