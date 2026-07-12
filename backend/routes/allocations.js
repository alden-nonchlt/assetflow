import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/*
=========================================
GET ALL ALLOCATIONS
=========================================
*/

router.get("/", requireAuth, (req, res) => {
    try {

        const allocations = db.prepare(`
            SELECT
                a.*,
                u.name AS user_name,
                u.email,
                s.name AS asset_name,
                s.asset_tag
            FROM allocations a
            LEFT JOIN users u
                ON a.allocated_to_user_id = u.id
            LEFT JOIN assets s
                ON a.asset_id = s.id
            ORDER BY a.created_at DESC
        `).all();

        res.json({
            success: true,
            data: allocations
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch allocations."
        });

    }
});

/*
=========================================
ALLOCATE ASSET
=========================================
*/

router.post("/", requireAuth, (req, res) => {

    try {

        const {
            asset_id,
            allocated_to_user_id,
            department_id,
            expected_return_date,
            notes
        } = req.body;

        if (!asset_id || !allocated_to_user_id) {
            return res.status(400).json({
                success: false,
                message: "Asset and User are required."
            });
        }

        // Check asset exists
        const asset = db.prepare(`
            SELECT *
            FROM assets
            WHERE id = ?
        `).get(asset_id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        // Check user exists
        const user = db.prepare(`
            SELECT *
            FROM users
            WHERE id = ?
        `).get(allocated_to_user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if asset is already allocated
        if (asset.status !== "available") {

            const currentAllocation = db.prepare(`
                SELECT
                    u.name,
                    u.email
                FROM allocations a
                JOIN users u
                    ON a.allocated_to_user_id = u.id
                WHERE
                    a.asset_id = ?
                    AND a.status = 'active'
                LIMIT 1
            `).get(asset_id);

            return res.status(409).json({
                success: false,
                message: currentAllocation
                    ? `Asset is already allocated to ${currentAllocation.name} (${currentAllocation.email}).`
                    : "Asset is already allocated."
            });

        }

        // Create allocation
        const result = db.prepare(`
            INSERT INTO allocations
            (
                asset_id,
                allocated_to_user_id,
                department_id,
                expected_return_date,
                notes,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'active')
        `).run(
            asset_id,
            allocated_to_user_id,
            department_id || null,
            expected_return_date || null,
            notes || null
        );

        // Update asset status
        db.prepare(`
            UPDATE assets
            SET status = 'allocated'
            WHERE id = ?
        `).run(asset_id);

        res.status(201).json({
            success: true,
            message: "Asset allocated successfully.",
            allocation_id: result.lastInsertRowid
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Allocation failed."
        });

    }

});

/*
=========================================
RETURN ASSET
=========================================
*/

router.put("/return/:id", requireAuth, (req, res) => {

    try {

        const allocation = db.prepare(`
            SELECT *
            FROM allocations
            WHERE id = ?
        `).get(req.params.id);

        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found."
            });
        }

        db.prepare(`
            UPDATE allocations
            SET
                status = 'returned',
                returned_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(req.params.id);

        db.prepare(`
            UPDATE assets
            SET status = 'available'
            WHERE id = ?
        `).run(allocation.asset_id);

        res.json({
            success: true,
            message: "Asset returned successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to return asset."
        });

    }

});

export default router;