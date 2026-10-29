const express = require("express");

const {
  authenticateUser,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  getAdminStats,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get(
  "/admin",
  authenticateUser,
  allowRoles("SYSTEM_ADMIN"),
  getAdminStats
);

module.exports = router;