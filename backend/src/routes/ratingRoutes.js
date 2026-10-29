const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const { submitRating } = require("../controllers/ratingController");

const router = express.Router();

router.post("/:storeId", authenticateUser, submitRating);

module.exports = router;