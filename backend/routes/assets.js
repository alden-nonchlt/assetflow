import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/*
=========================================
GET ALL ASSETS
=========================================
*/

router.get("/", requireAuth, (req, res) => {
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
});

/*
=========================================
GET ASSET BY ID
=========================================
*/

router.get("/:id", requireAuth, (req, res) => {

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

});

/*
=========================================
SEARCH ASSETS
=========================================
*/

router.get("/search/:keyword", requireAuth, (req, res) => {

    try {

        const keyword = `%${req.params.keyword}%`;

        const assets = db.prepare(`
            SELECT
                a.*,
                ac.name AS category_name
            FROM assets a
            LEFT JOIN asset_categories ac
                ON a.category_id = ac.id
            WHERE
                a.name LIKE ?
                OR a.asset_tag LIKE ?
                OR a.serial_number LIKE ?
            ORDER BY a.name
        `).all(
            keyword,
            keyword,
            keyword
        );

        res.json({
            success: true,
            data: assets
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Search failed."
        });

    }

});

/*
=========================================
FILTER BY STATUS
=========================================
*/

router.get("/status/:status", requireAuth, (req, res) => {

    try {

        const assets = db.prepare(`
            SELECT
                a.*,
                ac.name AS category_name
            FROM assets a
            LEFT JOIN asset_categories ac
                ON a.category_id = ac.id
            WHERE a.status = ?
        `).all(req.params.status);

        res.json({
            success: true,
            data: assets
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to filter assets."
        });

    }

});

export default router;