import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { logActivity } from "../utils/activityLogger.js";

const router = Router();

/*
=========================================
GET ALL DEPARTMENTS
GET /api/admin/departments
=========================================
*/

router.get(
    "/",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        const departments = db.prepare(`
            SELECT
                d.*,
                u.name AS head_name
            FROM departments d
            LEFT JOIN users u
                ON d.head_user_id = u.id
            ORDER BY d.name
        `).all();

        res.json({
            success: true,
            data: departments
        });

    }
);

/*
=========================================
CREATE DEPARTMENT
POST /api/admin/departments
=========================================
*/

router.post(
    "/",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            const {
                name,
                head_user_id,
                parent_department_id
            } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Department name is required."
                });
            }

            const exists = db.prepare(`
                SELECT id
                FROM departments
                WHERE name = ?
            `).get(name);

            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Department already exists."
                });
            }

            const result = db.prepare(`
                INSERT INTO departments
                (
                    name,
                    head_user_id,
                    parent_department_id
                )
                VALUES (?, ?, ?)
            `).run(
                name,
                head_user_id || null,
                parent_department_id || null
            );

            logActivity(
                req.user.id,
                `Created department "${name}".`
            );

            res.status(201).json({
                success: true,
                message: "Department created successfully.",
                department_id: result.lastInsertRowid
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to create department."
            });

        }

    }
);

/*
=========================================
UPDATE DEPARTMENT
PUT /api/admin/departments/:id
=========================================
*/

router.put(
    "/:id",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            const { id } = req.params;

            const {
                name,
                head_user_id,
                parent_department_id,
                status
            } = req.body;

            db.prepare(`
                UPDATE departments
                SET
                    name = ?,
                    head_user_id = ?,
                    parent_department_id = ?,
                    status = ?
                WHERE id = ?
            `).run(
                name,
                head_user_id || null,
                parent_department_id || null,
                status,
                id
            );

            logActivity(
                req.user.id,
                `Updated department #${id}.`
            );

            res.json({
                success: true,
                message: "Department updated."
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Update failed."
            });

        }

    }
);

/*
=========================================
DEACTIVATE DEPARTMENT
PATCH /api/admin/departments/:id/deactivate
=========================================
*/

router.patch(
    "/:id/deactivate",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        const { id } = req.params;

        db.prepare(`
            UPDATE departments
            SET status='inactive'
            WHERE id=?
        `).run(id);

        logActivity(
            req.user.id,
            `Deactivated department #${id}.`
        );

        res.json({
            success: true,
            message: "Department deactivated."
        });

    }
);

export default router;