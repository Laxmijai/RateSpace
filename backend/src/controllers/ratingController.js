const Store = require("../models/Store");
const Rating = require("../models/Rating");

async function submitRating(req, res) {
  try {
    const { storeId } = req.params;
    const { score } = req.body;

    if (!/^[a-f\d]{24}$/i.test(storeId)) {
      return res.status(400).json({
        message: "Invalid store ID.",
      });
    }

    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number from 1 to 5.",
      });
    }

    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        message: "Store not found.",
      });
    }

    // The logged-in user's ID comes from the JWT middleware,
    // not from the request body.
    const rating = await Rating.findOneAndUpdate(
      {
        store: store._id,
        user: req.user.id,
      },
      {
        $set: { score },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: "Rating submitted successfully.",
      rating,
    });
  } catch (error) {
    console.error("Submit rating error:", error);

    return res.status(500).json({
      message: "Could not submit rating.",
    });
  }
}

module.exports = { submitRating };