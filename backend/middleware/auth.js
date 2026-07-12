import jwt from "jsonwebtoken";
import db from "../db.js";

export function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = db.prepare(`
            SELECT
                id,
                name,
                email,
                role,
                department_id,
                status
            FROM users
            WHERE id = ?
        `).get(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "User account is inactive"
            });
        }

        req.user = user;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
}