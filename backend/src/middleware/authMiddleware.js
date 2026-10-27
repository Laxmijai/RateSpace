const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Expect: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please log in to access this resource.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token's signature and expiration.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm the user still exists in the database.
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User account not found.",
      });
    }

    // Make the authenticated user available to later handlers.
    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

function allowRoles(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
}

module.exports = { authenticateUser, allowRoles };