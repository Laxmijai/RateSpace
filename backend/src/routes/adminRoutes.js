const express = require("express");

const {
  authenticateUser,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  createUser,
  getUsers,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authenticateUser, allowRoles("SYSTEM_ADMIN"));

router.post("/users", createUser);
router.get("/users", getUsers);

module.exports = router;