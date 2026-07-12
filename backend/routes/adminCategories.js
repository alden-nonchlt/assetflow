    import { Router } from "express";
    import db from "../db.js";
    import { requireAuth } from "../middleware/auth.js";
    import { requireRole } from "../middleware/requireRole.js";

    const router = Router();

    // GET ALL CATEGORIES
    router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT
            c.id,
            c.name,
            c.department_id,
            d.name AS department_name,
            c.created_at
        FROM categories c
        LEFT JOIN departments d ON c.department_id = d.id
        ORDER BY d.name ASC, c.name ASC
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
        message: "Failed to fetch categories",
        });
    }
    });

    // GET SINGLE CATEGORY
    router.get("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
        `
        SELECT
            c.id,
            c.name,
            c.department_id,
            d.name AS department_name,
            c.created_at
        FROM categories c
        LEFT JOIN departments d
        ON c.department_id = d.id
        WHERE c.id = ?
        `,
        [id]
        );

        if (rows.length === 0) {
        return res.status(404).json({
            message: "Category not found",
        });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
        message: "Failed to fetch category",
        });
    }
    });

    // CREATE CATEGORY
    router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { name, department_id } = req.body;

        if (!name || !department_id) {
        return res.status(400).json({
            message: "Name and department are required",
        });
        }

        const [department] = await db.query(
        "SELECT id FROM departments WHERE id = ?",
        [department_id]
        );

        if (department.length === 0) {
        return res.status(404).json({
            message: "Department not found",
        });
        }

        const [existing] = await db.query(
        "SELECT id FROM categories WHERE name = ? AND department_id = ?",
        [name.trim(), department_id]
        );

        if (existing.length > 0) {
        return res.status(409).json({
            message: "Category already exists in this department",
        });
        }

        const [result] = await db.query(
        `
        INSERT INTO categories (name, department_id)
        VALUES (?, ?)
        `,
        [name.trim(), department_id]
        );

        res.status(201).json({
        message: "Category created successfully",
        id: result.insertId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
        message: "Failed to create category",
        });
    }
    });

    // UPDATE CATEGORY
    router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department_id } = req.body;

        if (!name || !department_id) {
        return res.status(400).json({
            message: "Name and department are required",
        });
        }

        const [category] = await db.query(
        "SELECT id FROM categories WHERE id = ?",
        [id]
        );

        if (category.length === 0) {
        return res.status(404).json({
            message: "Category not found",
        });
        }

        const [department] = await db.query(
        "SELECT id FROM departments WHERE id = ?",
        [department_id]
        );

        if (department.length === 0) {
        return res.status(404).json({
            message: "Department not found",
        });
        }

        const [duplicate] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE name = ?
        AND department_id = ?
        AND id != ?
        `,
        [name.trim(), department_id, id]
        );

        if (duplicate.length > 0) {
        return res.status(409).json({
            message: "Category already exists in this department",
        });
        }

        await db.query(
        `
        UPDATE categories
        SET
            name = ?,
            department_id = ?
        WHERE id = ?
        `,
        [name.trim(), department_id, id]
        );

        res.json({
        message: "Category updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
        message: "Failed to update category",
        });
    }
    });

    // DELETE CATEGORY
    router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;

        const [category] = await db.query(
        "SELECT id FROM categories WHERE id = ?",
        [id]
        );

        if (category.length === 0) {
        return res.status(404).json({
            message: "Category not found",
        });
        }

        const [products] = await db.query(
        "SELECT id FROM products WHERE category_id = ? LIMIT 1",
        [id]
        );

        if (products.length > 0) {
        return res.status(400).json({
            message: "Cannot delete category with existing products",
        });
        }

        await db.query("DELETE FROM categories WHERE id = ?", [id]);

        res.json({
        message: "Category deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
        message: "Failed to delete category",
        });
    }
    });

export default router;