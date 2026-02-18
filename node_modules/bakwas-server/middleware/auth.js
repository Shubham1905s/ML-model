import jwt from "jsonwebtoken";

function getAccessSecret() {
  return process.env.ACCESS_TOKEN_SECRET || "dev-access-secret";
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }
 
  try {
    const payload = jwt.verify(token, getAccessSecret());
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, getAccessSecret());
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
  } catch (error) {
    req.user = null;
  }
  return next();
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: "Not authorized." });
    }
    return next();
  };
}
 
