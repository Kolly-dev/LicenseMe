const express = require("express");
const router = express.Router();

const {
	createLicense,
	getLicenses,
	acceptLicense,
	rejectLicense,
} = require("../controllers/licenseController");
const auth = require("../middlewares/authMiddleware");

router.post("/createlicense", auth, createLicense);
router.get("/getlicenses", auth, getLicenses);
router.put("/acceptlicense", auth, acceptLicense);
router.put("/rejectlicense", auth, rejectLicense);

module.exports = router;
