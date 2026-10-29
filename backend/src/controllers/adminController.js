const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (name.trim().length < 20 || name.trim().length > 60) {
      return res.status(400).json({
        message: "Name must contain 20 to 60 characters.",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)) {
      return res.status(400).json({
        message: "Password must be 8–16 characters with an uppercase and special character.",
      });
    }

    // Admins cannot create another administrator through this endpoint.
    if (!["NORMAL_USER", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      address: address.trim(),
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    return res.status(500).json({
      message: "Could not create user.",
    });
  }
}

async function getUsers(req, res) {
  try {
    const { search = "", role } = req.query;

    const filter = {};

    if (role) {
      if (!["SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role filter.",
        });
      }

      filter.role = role;
    }

    if (search.trim()) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }

    const users = await User.find(filter)
      .select("name email address role createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Could not fetch users.",
    });
  }
}

module.exports = { createUser, getUsers };