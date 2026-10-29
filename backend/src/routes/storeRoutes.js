const express = require("express");

const {
  authenticateUser,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  getStores,
  createStore,
} = require("../controllers/storeController");

const router = express.Router();

router.get("/", authenticateUser, getStores);

router.post(
  "/",
  authenticateUser,
  allowRoles("SYSTEM_ADMIN"),
  createStore
);

module.exports = router;