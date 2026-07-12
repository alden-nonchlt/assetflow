import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/*
=========================================
GET ALL BOOKINGS
=========================================
*/

router.get("/", requireAuth, (req, res) => {

    try {

        const bookings = db.prepare(`
            SELECT
                b.*,
                a.name AS asset_name,
                a.asset_tag,
                u.name AS booked_by
            FROM bookings b
            LEFT JOIN assets a
                ON b.resource_asset_id = a.id
            LEFT JOIN users u
                ON b.booked_by_user_id = u.id
            ORDER BY b.start_time DESC
        `).all();

        res.json({
            success: true,
            data: bookings
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings."
        });

    }

});

/*
=========================================
GET BOOKING BY ID
=========================================
*/

router.get("/:id", requireAuth, (req, res) => {

    try {

        const booking = db.prepare(`
            SELECT
                b.*,
                a.name AS asset_name,
                a.asset_tag,
                u.name AS booked_by
            FROM bookings b
            LEFT JOIN assets a
                ON b.resource_asset_id = a.id
            LEFT JOIN users u
                ON b.booked_by_user_id = u.id
            WHERE b.id = ?
        `).get(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.json({
            success: true,
            data: booking
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch booking."
        });

    }

});

/*
=========================================
CREATE BOOKING
=========================================
*/

router.post("/", requireAuth, (req, res) => {

    try {

        const {
            resource_asset_id,
            start_time,
            end_time
        } = req.body;

        const booked_by_user_id = req.user.id;

        if (
            !resource_asset_id ||
            !start_time ||
            !end_time
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Asset exists?
        const asset = db.prepare(`
            SELECT *
            FROM assets
            WHERE id = ?
        `).get(resource_asset_id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });
        }

        // Bookable?
        if (asset.is_bookable !== 1) {
            return res.status(400).json({
                success: false,
                message: "This asset cannot be booked."
            });
        }

        // Validate time range
        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time."
            });
        }

        // Check overlapping bookings
        const overlap = db.prepare(`
            SELECT
                id,
                start_time,
                end_time
            FROM bookings
            WHERE
                resource_asset_id = ?
                AND status != 'cancelled'
                AND (? < end_time)
                AND (? > start_time)
            LIMIT 1
        `).get(
            resource_asset_id,
            start_time,
            end_time
        );

        if (overlap) {

            return res.status(409).json({
                success: false,
                message: "This asset is already booked for the selected time."
            });

        }

        const result = db.prepare(`
            INSERT INTO bookings
            (
                resource_asset_id,
                booked_by_user_id,
                start_time,
                end_time,
                status
            )
            VALUES (?, ?, ?, ?, 'upcoming')
        `).run(
            resource_asset_id,
            booked_by_user_id,
            start_time,
            end_time
        );

        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            id: result.lastInsertRowid
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create booking."
        });

    }

});

/*
=========================================
CANCEL BOOKING
=========================================
*/

router.put("/:id/cancel", requireAuth, (req, res) => {

    try {

        const booking = db.prepare(`
            SELECT *
            FROM bookings
            WHERE id = ?
        `).get(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        db.prepare(`
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = ?
        `).run(req.params.id);

        res.json({
            success: true,
            message: "Booking cancelled successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to cancel booking."
        });

    }

});

export default router;