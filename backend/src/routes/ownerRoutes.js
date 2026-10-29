const express = require("express");

const {
  authenticateUser,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  getOwnerDashboard,
} = require("../controllers/ownerController");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateUser,
  allowRoles("STORE_OWNER"),
  getOwnerDashboard
);

module.exports = router;