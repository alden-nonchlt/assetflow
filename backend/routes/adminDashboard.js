import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();


router.get("/", requireAuth, requireRole("admin"), (req, res) => {

    try {


        const users = db.prepare(`
            SELECT COUNT(*) AS count
            FROM users
        `).get();


        const departments = db.prepare(`
            SELECT COUNT(*) AS count
            FROM departments
        `).get();


        const categories = db.prepare(`
            SELECT COUNT(*) AS count
            FROM asset_categories
        `).get();



        const assets = db.prepare(`
            SELECT COUNT(*) AS count
            FROM assets
        `).get();



        const available = db.prepare(`
            SELECT COUNT(*) AS count
            FROM assets
            WHERE status = 'available'
        `).get();



        const allocated = db.prepare(`
            SELECT COUNT(*) AS count
            FROM assets
            WHERE status = 'allocated'
        `).get();



        const maintenance = db.prepare(`
            SELECT COUNT(*) AS count
            FROM assets
            WHERE status = 'under_maintenance'
        `).get();




        const overdue = db.prepare(`
            SELECT
                a.id,
                a.asset_tag,
                a.name AS asset_name,
                u.name AS user_name,
                al.expected_return_date
            FROM allocations al
            LEFT JOIN assets a
                ON al.asset_id = a.id
            LEFT JOIN users u
                ON al.allocated_to_user_id = u.id
            WHERE
                al.status = 'active'
                AND al.expected_return_date < DATE('now')
        `).all();





        const recentAssets = db.prepare(`
            SELECT
                a.id,
                a.name,
                a.asset_tag,
                a.status,
                ac.name AS category
            FROM assets a
            LEFT JOIN asset_categories ac
                ON a.category_id = ac.id
            ORDER BY a.id DESC
            LIMIT 5
        `).all();





        res.json({

            success:true,

            dashboard:{

                users: users.count,

                departments: departments.count,

                categories: categories.count,

                products: assets.count,

                available: available.count,

                allocated: allocated.count,

                maintenance: maintenance.count,

                overdue,

                recentAssets

            }

        });



    }
    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:"Failed to load dashboard"

        });

    }

});


export default router;