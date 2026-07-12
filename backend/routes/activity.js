import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/*
=========================================
GET RECENT ACTIVITY
=========================================
*/

router.get("/", requireAuth, (req, res) => {

    try {

        const activities = db.prepare(`
            SELECT
                al.id,
                al.action_description,
                al.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email
            FROM activity_logs al
            LEFT JOIN users u
                ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT 100
        `).all();

        res.json({
            success: true,
            data: activities
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch activity logs."
        });

    }

});

/*
=========================================
GET ACTIVITY OF A USER
=========================================
*/

router.get("/user/:userId", requireAuth, (req, res) => {

    try {

        const activities = db.prepare(`
            SELECT
                id,
                action_description,
                created_at
            FROM activity_logs
            WHERE user_id = ?
            ORDER BY created_at DESC
        `).all(req.params.userId);

        res.json({
            success: true,
            data: activities
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch user activity."
        });

    }

});

/*
=========================================
GET SINGLE ACTIVITY
=========================================
*/

router.get("/:id", requireAuth, (req, res) => {

    try {

        const activity = db.prepare(`
            SELECT
                al.*,
                u.name AS user_name,
                u.email
            FROM activity_logs al
            LEFT JOIN users u
                ON al.user_id = u.id
            WHERE al.id = ?
        `).get(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found."
            });
        }

        res.json({
            success: true,
            data: activity
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch activity."
        });

    }

});

export default router;