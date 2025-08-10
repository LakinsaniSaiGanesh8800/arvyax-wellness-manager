const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No Authorization header" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Malformed auth header" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET not configured" });

    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      req.user = { id: decoded.id, email: decoded.email };
      next();
    });
  } catch (err) {
    console.error("authJwt error:", err);
    res.status(500).json({ message: "Authorization error" });
  }
};
