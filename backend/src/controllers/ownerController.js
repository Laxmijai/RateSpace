const Store = require("../models/Store");
const Rating = require("../models/Rating");

async function getOwnerDashboard(req, res) {
  try {
    // Only return stores belonging to the logged-in owner.
    const stores = await Store.find({
      owner: req.user.id,
    }).select("name address");

    const dashboard = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({
          store: store._id,
        })
          .populate("user", "name email")
          .select("score user createdAt");

        const total = ratings.reduce(
          (sum, rating) => sum + rating.score,
          0
        );

        const averageRating =
          ratings.length > 0
            ? Number((total / ratings.length).toFixed(2))
            : 0;

        return {
          store: {
            id: store._id,
            name: store.name,
            address: store.address,
          },
          averageRating,
          ratingCount: ratings.length,
          ratings: ratings.map((rating) => ({
            score: rating.score,
            submittedAt: rating.createdAt,
            user: rating.user
              ? {
                  name: rating.user.name,
                  email: rating.user.email,
                }
              : null,
          })),
        };
      })
    );

    return res.json({
      stores: dashboard,
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);

    return res.status(500).json({
      message: "Could not load owner dashboard.",
    });
  }
}

module.exports = { getOwnerDashboard };