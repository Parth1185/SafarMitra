import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    // Check cookie first
    let token = req.cookies?.token;

    // If not found in cookies, check the Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id; // Attach user ID to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
