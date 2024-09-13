const express = require("express");
const router = express.Router();

const {
	createCommission,
	getCommissions,
} = require("../controllers/commissionController");
const auth = require("../middlewares/authMiddleware");

router.post("/createcommission", auth, createCommission);
router.get("/getcommissions", auth, getCommissions);

module.exports = router;
