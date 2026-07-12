import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// ==============================
// ADMIN DASHBOARD
// ==============================

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const [[users]] = await db.query(
            "SELECT COUNT(*) AS totalUsers FROM users"
        );

        const [[departments]] = await db.query(
            "SELECT COUNT(*) AS totalDepartments FROM departments"
        );

        const [[categories]] = await db.query(
            "SELECT COUNT(*) AS totalCategories FROM categories"
        );

        const [[products]] = await db.query(
            "SELECT COUNT(*) AS totalProducts FROM products"
        );

        const [[available]] = await db.query(
            "SELECT COUNT(*) AS availableAssets FROM products WHERE status='Available'"
        );

        const [[allocated]] = await db.query(
            "SELECT COUNT(*) AS allocatedAssets FROM products WHERE status='Allocated'"
        );

        const [[maintenance]] = await db.query(
            "SELECT COUNT(*) AS maintenanceAssets FROM products WHERE status='Maintenance'"
        );

        const [recentAssets] = await db.query(`
            SELECT
                p.id,
                p.name,
                p.asset_code,
                p.status,
                p.created_at,
                c.name AS category
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT 5
        `);

        res.json({
            success: true,
            dashboard: {
                users: users.totalUsers,
                departments: departments.totalDepartments,
                categories: categories.totalCategories,
                products: products.totalProducts,
                available: available.availableAssets,
                allocated: allocated.allocatedAssets,
                maintenance: maintenance.maintenanceAssets,
                recentAssets
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        });
    }
});

export default router;  