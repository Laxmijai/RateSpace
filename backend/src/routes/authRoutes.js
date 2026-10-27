const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  authenticateUser,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route: any logged-in user
router.get("/me", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "User authenticated successfully.",
    user: req.user,
  });
});

// Example of a route restricted to administrators
router.get(
  "/admin-check",
  authenticateUser,
  allowRoles("SYSTEM_ADMIN"),
  (req, res) => {
    res.json({
      message: "Administrator access granted.",
    });
  }
);

module.exports = router;