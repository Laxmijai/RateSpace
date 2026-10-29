const Store = require("../models/Store");
const User = require("../models/User");
const Rating = require("../models/Rating");

async function getStores(req, res) {
  try {
    const { search = "", sortBy = "name", order = "asc" } = req.query;

    // Only allow supported sorting fields.
    const allowedSortFields = ["name", "averageRating"];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: "Invalid sorting field.",
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        message: "Order must be asc or desc.",
      });
    }

    const searchRegex = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const stores = await Store.aggregate([
      {
        $match: {
          $or: [
            { name: searchRegex },
            { address: searchRegex },
          ],
        },
      },
      {
        $lookup: {
          from: Rating.collection.name,
          localField: "_id",
          foreignField: "store",
          as: "ratings",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.score" },
          ratingCount: { $size: "$ratings" },
        },
      },
      {
        $addFields: {
          averageRating: {
            $ifNull: ["$averageRating", 0],
          },
        },
      },
      {
        $sort: {
          [sortBy === "averageRating" ? "averageRating" : "name"]:
            order === "asc" ? 1 : -1,
          _id: 1,
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          owner: 1,
          averageRating: 1,
          ratingCount: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    return res.status(500).json({
      message: "Could not fetch stores.",
    });
  }
}

async function createStore(req, res) {
  try {
    const { name, address, ownerId } = req.body;

    if (!name?.trim() || !address?.trim() || !ownerId) {
      return res.status(400).json({
        message: "Store name, address, and owner are required.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        message: "Store name cannot exceed 100 characters.",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters.",
      });
    }

    if (!/^[a-f\d]{24}$/i.test(ownerId)) {
      return res.status(400).json({
        message: "Invalid owner ID.",
      });
    }

    const owner = await User.findById(ownerId);

    if (!owner || owner.role !== "STORE_OWNER") {
      return res.status(400).json({
        message: "Please select a valid store owner.",
      });
    }

    const store = await Store.create({
      name: name.trim(),
      address: address.trim(),
      owner: owner._id,
    });

    return res.status(201).json({
      message: "Store created successfully.",
      store,
    });
  } catch (error) {
    console.error("Create store error:", error);

    return res.status(500).json({
      message: "Could not create store.",
    });
  }
}

module.exports = { getStores, createStore };