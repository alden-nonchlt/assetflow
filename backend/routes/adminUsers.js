import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

/*
=========================================
GET ALL USERS
=========================================
*/

router.get("/", requireAuth, requireRole("admin"), (req, res) => {
    try {

        const users = db.prepare(`
            SELECT
                id,
                name,
                email,
                role,
                department_id,
                status,
                created_at
            FROM users
            ORDER BY created_at DESC
        `).all();

        res.json({
            success: true,
            data: users
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });

    }
});

/*
=========================================
GET USER BY ID
=========================================
*/

router.get("/:id", requireAuth, requireRole("admin"), (req, res) => {
    try {

        const user = db.prepare(`
            SELECT
                id,
                name,
                email,
                role,
                department_id,
                status,
                created_at
            FROM users
            WHERE id = ?
        `).get(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch user."
        });

    }
});

/*
=========================================
UPDATE USER
=========================================
*/

router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {

    try {

        const { role, department_id } = req.body;

        db.prepare(`
            UPDATE users
            SET
                role = ?,
                department_id = ?
            WHERE id = ?
        `).run(
            role,
            department_id || null,
            req.params.id
        );

        res.json({
            success: true,
            message: "User updated successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to update user."
        });

    }

});

/*
=========================================
DELETE USER
=========================================
*/

router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {

    try {

        db.prepare(`
            DELETE FROM users
            WHERE id = ?
        `).run(req.params.id);

        res.json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete user."
        });

    }

});

export default router;