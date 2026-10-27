const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function isValidPassword(password) {
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

  return passwordPattern.test(password);
}

async function register(req, res) {
  try {
    const { name, email, address, password } = req.body;

    // Check that all required fields are provided.
    if (!name || !email || !address || !password) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    // Validate the name.
    if (name.trim().length < 20 || name.trim().length > 60) {
      return res.status(400).json({
        message: "Name must contain 20 to 60 characters.",
      });
    }

    // Validate the email format.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // Validate the address.
    if (address.trim().length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters.",
      });
    }

    // Validate the password.
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 characters and contain an uppercase letter and a special character.",
      });
    }

    // Check whether the email is already registered.
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Never store a plain-text password in the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Public registration always creates a normal user.
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      password: hashedPassword,
      role: "NORMAL_USER",
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle a duplicate email even if two requests arrive together.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Could not register user.",
    });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // select("+password") includes the password field
    // because our User schema hides it by default.
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare the entered password with its stored hash.
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create a signed token that expires after one day.
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Could not log in.",
    });
  }
}

module.exports = { register, login };

