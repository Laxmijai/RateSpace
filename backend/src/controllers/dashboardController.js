const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

async function getAdminStats(req, res) {
  try {
    const [totalUsers, totalStores, totalRatings] =
      await Promise.all([
        User.countDocuments(),
        Store.countDocuments(),
        Rating.countDocuments(),
      ]);

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return res.status(500).json({
      message: "Could not load dashboard statistics.",
    });
  }
}

module.exports = { getAdminStats };