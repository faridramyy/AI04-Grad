import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // fallback if .env isn't set

/**
 * Flexible authentication middleware.
 * 
 * @param {"none" | "logged" | "admin"} accessLevel - defines required auth level
 */
export const authMiddleware = (accessLevel = "none") => {
    return (req, res, next) => {
        try {
            // Public route – no auth needed
            if (accessLevel === "none") return next();

            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ error: "No token provided." });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded; // store user info (id, role) in req

            if (accessLevel === "admin" && decoded.role !== "admin") {
                return res.status(403).json({ error: "Access denied. Admins only." });
            }

            // If it's just a "logged" check, we're good to go
            next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token." });
        }
    };
};