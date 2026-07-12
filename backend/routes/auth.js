import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { logActivity } from "../utils/activityLogger.js";

const router = Router();

/*
==========================================
POST /api/auth/signup
==========================================
Creates ONLY employee accounts.
Role is NEVER accepted from frontend.
==========================================
*/

router.post("/signup", async (req, res) => {
    try {

        const { name, email, password, department_id } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        const existing = db.prepare(`
            SELECT id
            FROM users
            WHERE email = ?
        `).get(email);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        // 🔥 BUSINESS RULE
        // Always employee.
        // Ignore any incoming role.

        const result = db.prepare(`
            INSERT INTO users
            (
                name,
                email,
                password_hash,
                role,
                department_id
            )
            VALUES
            (
                ?,
                ?,
                ?,
                'employee',
                ?
            )
        `).run(
            name,
            email,
            password_hash,
            department_id || null
        );

        const userId = result.lastInsertRowid;

        logActivity(
            userId,
            "User account created."
        );

        const token = jwt.sign(
            {
                id: userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            token,
            role: "employee"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Signup failed."
        });

    }
});


/*
==========================================
POST /api/auth/login
==========================================
*/

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = db.prepare(`
            SELECT *
            FROM users
            WHERE email = ?
        `).get(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Account inactive."
            });
        }

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        logActivity(
            user.id,
            "Logged in."
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department_id: user.department_id
            }
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Login failed."
        });

    }

});


/*
==========================================
GET /api/auth/me
==========================================
*/

router.get(
    "/me",
    requireAuth,
    (req, res) => {

        res.json({
            success: true,
            user: req.user
        });

    }
);

export default router;