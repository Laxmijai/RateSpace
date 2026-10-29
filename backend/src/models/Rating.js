const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number from 1 to 5",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Each user can have only one rating per store.
ratingSchema.index({ store: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);