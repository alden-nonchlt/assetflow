import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

/*
=========================================
GET ALL ASSETS
=========================================
*/

router.get(
    "/",
    requireAuth,
    requireRole("admin"),
    (req, res) => {
        try {

            const assets = db.prepare(`
                SELECT
                    a.*,
                    ac.name AS category_name
                FROM assets a
                LEFT JOIN asset_categories ac
                    ON a.category_id = ac.id
                ORDER BY a.id DESC
            `).all();

            res.json({
                success: true,
                data: assets
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to fetch assets."
            });

        }
    }
);

/*
=========================================
GET ASSET BY ID
=========================================
*/

router.get(
    "/:id",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            const asset = db.prepare(`
                SELECT
                    a.*,
                    ac.name AS category_name
                FROM assets a
                LEFT JOIN asset_categories ac
                    ON a.category_id = ac.id
                WHERE a.id = ?
            `).get(req.params.id);

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: "Asset not found."
                });
            }

            res.json({
                success: true,
                data: asset
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to fetch asset."
            });

        }

    }
);

/*
=========================================
CREATE ASSET
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
                category_id,
                serial_number,
                acquisition_date,
                acquisition_cost,
                condition,
                location,
                photo_url,
                is_bookable,
                status
            } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Asset name is required."
                });
            }

            // Generate Asset Tag
            const lastAsset = db.prepare(`
                SELECT asset_tag
                FROM assets
                ORDER BY id DESC
                LIMIT 1
            `).get();

            let nextNumber = 1;

            if (lastAsset && lastAsset.asset_tag) {
                const current = parseInt(
                    lastAsset.asset_tag.replace("AF-", ""),
                    10
                );

                if (!isNaN(current)) {
                    nextNumber = current + 1;
                }
            }

            const assetTag =
                `AF-${String(nextNumber).padStart(4, "0")}`;

            const result = db.prepare(`
                INSERT INTO assets (
                    asset_tag,
                    name,
                    category_id,
                    serial_number,
                    acquisition_date,
                    acquisition_cost,
                    condition,
                    location,
                    photo_url,
                    is_bookable,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                assetTag,
                name,
                category_id || null,
                serial_number || null,
                acquisition_date || null,
                acquisition_cost || null,
                condition || null,
                location || null,
                photo_url || null,
                is_bookable ? 1 : 0,
                status || "available"
            );

            res.status(201).json({
                success: true,
                message: "Asset created successfully.",
                id: result.lastInsertRowid,
                asset_tag: assetTag
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to create asset."
            });

        }

    }
);

/*
=========================================
UPDATE ASSET
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
                category_id,
                serial_number,
                acquisition_date,
                acquisition_cost,
                condition,
                location,
                photo_url,
                is_bookable,
                status
            } = req.body;

            const asset = db.prepare(`
                SELECT asset_tag
                FROM assets
                WHERE id = ?
            `).get(req.params.id);

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: "Asset not found."
                });
            }

            db.prepare(`
                UPDATE assets
                SET
                    name = ?,
                    category_id = ?,
                    serial_number = ?,
                    acquisition_date = ?,
                    acquisition_cost = ?,
                    condition = ?,
                    location = ?,
                    photo_url = ?,
                    is_bookable = ?,
                    status = ?
                WHERE id = ?
            `).run(
                name,
                category_id || null,
                serial_number || null,
                acquisition_date || null,
                acquisition_cost || null,
                condition || null,
                location || null,
                photo_url || null,
                is_bookable ? 1 : 0,
                status,
                req.params.id
            );

            res.json({
                success: true,
                message: "Asset updated successfully."
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to update asset."
            });

        }

    }
);

/*
=========================================
DELETE ASSET
=========================================
*/

router.delete(
    "/:id",
    requireAuth,
    requireRole("admin"),
    (req, res) => {

        try {

            db.prepare(`
                DELETE FROM assets
                WHERE id = ?
            `).run(req.params.id);

            res.json({
                success: true,
                message: "Asset deleted successfully."
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Failed to delete asset."
            });

        }

    }
);

export default router;