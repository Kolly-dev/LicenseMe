const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
	createCompanyProfile,
	getCompanyProfiles,
	getCompanyProfile,
	getDistributors,
	deleteCompany,
	acceptDistributor,
} = require("../controllers/companyController");

router.post("/createcompanyprofile", auth, createCompanyProfile);
router.get("/getcompanyprofiles", auth, getCompanyProfiles);
router.get("/getcompanyprofile", auth, getCompanyProfile);
router.get("/getdistributors", auth, getDistributors);
router.put("/deletecompanyprofile", auth, deleteCompany);
router.put("/acceptdistributor", auth, acceptDistributor);

module.exports = router;
