import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();


// GET ALL CATEGORIES
router.get("/", requireAuth, requireRole("admin"), (req,res)=>{

    try {

        const categories = db.prepare(`
            SELECT
                c.id,
                c.name,
                c.department_id,
                d.name AS department_name,
                c.created_at
            FROM categories c
            LEFT JOIN departments d
                ON c.department_id = d.id
            ORDER BY c.name ASC
        `).all();


        res.json({
            success:true,
            data:categories
        });


    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Failed to fetch categories"
        });

    }

});




// CREATE CATEGORY
router.post("/", requireAuth, requireRole("admin"), (req,res)=>{

    try {

        const {
            name,
            department_id
        } = req.body;


        if(!name){

            return res.status(400).json({
                message:"Category name is required"
            });

        }



        const exists = db.prepare(`
            SELECT id
            FROM categories
            WHERE name = ?
        `).get(name);



        if(exists){

            return res.status(409).json({
                message:"Category already exists"
            });

        }



        const result = db.prepare(`
            INSERT INTO categories
            (
                name,
                department_id
            )
            VALUES (?,?)
        `).run(
            name,
            department_id || null
        );



        res.status(201).json({

            success:true,

            message:"Category created successfully",

            id:result.lastInsertRowid

        });



    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Failed to create category"
        });

    }

});





// UPDATE CATEGORY
router.put("/:id", requireAuth, requireRole("admin"), (req,res)=>{

    try {

        const {
            name,
            department_id
        } = req.body;


        db.prepare(`
            UPDATE categories
            SET
                name=?,
                department_id=?
            WHERE id=?
        `).run(
            name,
            department_id || null,
            req.params.id
        );


        res.json({
            success:true,
            message:"Category updated"
        });


    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Failed to update category"
        });

    }

});





// DELETE CATEGORY
router.delete("/:id", requireAuth, requireRole("admin"), (req,res)=>{

    try {


        db.prepare(`
            DELETE FROM categories
            WHERE id=?
        `).run(req.params.id);



        res.json({

            success:true,

            message:"Category deleted"

        });


    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Failed to delete category"
        });

    }

});


export default router;