import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

/*
=========================================
GET ALL CATEGORIES
=========================================
*/

router.get(
    "/",
    requireAuth,
    requireRole("admin"),
    (req, res) => {
        try {

            const categories = db.prepare(`
                SELECT *
                FROM asset_categories
                ORDER BY name
            `).all();

            res.json({
                success: true,
                data: categories
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to fetch categories."
            });

        }
    }
);

/*
=========================================
GET CATEGORY BY ID
=========================================
*/

router.get(
    "/:id",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            const category = db.prepare(`
                SELECT *
                FROM asset_categories
                WHERE id = ?
            `).get(req.params.id);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found."
                });
            }

            res.json({
                success: true,
                data: category
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to fetch category."
            });

        }

    }
);

/*
=========================================
CREATE CATEGORY
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
                extra_fields_json
            } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Category name is required."
                });
            }

            const exists = db.prepare(`
                SELECT id
                FROM asset_categories
                WHERE name = ?
            `).get(name);

            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Category already exists."
                });
            }

            const result = db.prepare(`
                INSERT INTO asset_categories
                (
                    name,
                    extra_fields_json
                )
                VALUES (?, ?)
            `).run(
                name,
                extra_fields_json || null
            );

            res.status(201).json({
                success: true,
                message: "Category created successfully.",
                id: result.lastInsertRowid
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to create category."
            });

        }

    }
);

/*
=========================================
UPDATE CATEGORY
=========================================
*/

router.put(
    "/:id",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            const {
                name,
                extra_fields_json
            } = req.body;

            db.prepare(`
                UPDATE asset_categories
                SET
                    name = ?,
                    extra_fields_json = ?
                WHERE id = ?
            `).run(
                name,
                extra_fields_json || null,
                req.params.id
            );

            res.json({
                success: true,
                message: "Category updated successfully."
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to update category."
            });

        }

    }
);

/*
=========================================
DELETE CATEGORY
=========================================
*/

router.delete(
    "/:id",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            db.prepare(`
                DELETE FROM asset_categories
                WHERE id = ?
            `).run(req.params.id);

            res.json({
                success: true,
                message: "Category deleted successfully."
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to delete category."
            });

        }

    }
);

export default router;