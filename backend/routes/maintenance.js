import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();


/*
=========================================
GET ALL MAINTENANCE REQUESTS
=========================================
*/

router.get("/", requireAuth, (req, res) => {

    try {

        const requests = db.prepare(`
            SELECT
                m.*,
                a.name AS asset_name,
                a.asset_tag,
                u.name AS raised_by
            FROM maintenance_requests m
            LEFT JOIN assets a
                ON m.asset_id = a.id
            LEFT JOIN users u
                ON m.raised_by_user_id = u.id
            ORDER BY m.created_at DESC
        `).all();


        res.json({
            success:true,
            data:requests
        });


    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Failed to fetch maintenance requests."
        });

    }

});




/*
=========================================
RAISE MAINTENANCE REQUEST
=========================================
*/

router.post("/", requireAuth, (req,res)=>{

    try {


        const {
            asset_id,
            description,
            priority
        } = req.body;



        const raised_by_user_id = req.user.id;



        if(!asset_id || !description){

            return res.status(400).json({

                success:false,

                message:"Asset and Description are required."

            });

        }



        const asset = db.prepare(`

            SELECT id
            FROM assets
            WHERE id = ?

        `).get(asset_id);



        if(!asset){

            return res.status(404).json({

                success:false,

                message:"Asset not found."

            });

        }




        const result = db.prepare(`

            INSERT INTO maintenance_requests
            (
                asset_id,
                raised_by_user_id,
                description,
                priority,
                status
            )

            VALUES (?, ?, ?, ?, 'pending')

        `).run(

            asset_id,

            raised_by_user_id,

            description,

            priority || "Medium"

        );




        res.status(201).json({

            success:true,

            message:"Maintenance request created.",

            id:result.lastInsertRowid

        });



    }
    catch(err){

        console.error(err);


        res.status(500).json({

            success:false,

            message:"Failed to create maintenance request."

        });

    }


});






/*
=========================================
APPROVE REQUEST
=========================================
*/

router.put("/:id/approve", requireAuth, (req,res)=>{

    try {


        const request = db.prepare(`

            SELECT *
            FROM maintenance_requests
            WHERE id = ?

        `).get(req.params.id);



        if(!request){

            return res.status(404).json({

                success:false,

                message:"Request not found."

            });

        }



        db.prepare(`

            UPDATE maintenance_requests
            SET status='approved'
            WHERE id=?

        `).run(req.params.id);




        db.prepare(`

            UPDATE assets
            SET status='under_maintenance'
            WHERE id=?

        `).run(request.asset_id);




        res.json({

            success:true,

            message:"Maintenance request approved."

        });



    }
    catch(err){

        console.error(err);


        res.status(500).json({

            success:false,

            message:"Failed to approve request."

        });

    }


});






/*
=========================================
ASSIGN TECHNICIAN
=========================================
*/

router.put("/:id/assign", requireAuth, (req,res)=>{

    try {


        const request = db.prepare(`

            SELECT *
            FROM maintenance_requests
            WHERE id=?

        `).get(req.params.id);



        if(!request){

            return res.status(404).json({

                success:false,

                message:"Request not found."

            });

        }



        db.prepare(`

            UPDATE maintenance_requests
            SET status='assigned'
            WHERE id=?

        `).run(req.params.id);




        res.json({

            success:true,

            message:"Technician assigned."

        });



    }
    catch(err){

        console.error(err);


        res.status(500).json({

            success:false,

            message:"Failed to assign technician."

        });

    }


});







/*
=========================================
START MAINTENANCE
=========================================
*/

router.put("/:id/start", requireAuth, (req,res)=>{

    try {


        db.prepare(`

            UPDATE maintenance_requests
            SET status='in_progress'
            WHERE id=?

        `).run(req.params.id);



        res.json({

            success:true,

            message:"Maintenance started."

        });



    }
    catch(err){

        console.error(err);


        res.status(500).json({

            success:false,

            message:"Failed to start maintenance."

        });

    }


});







/*
=========================================
REJECT REQUEST
=========================================
*/

router.put("/:id/reject", requireAuth, (req,res)=>{

    try {


        db.prepare(`

            UPDATE maintenance_requests
            SET status='rejected'
            WHERE id=?

        `).run(req.params.id);



        res.json({

            success:true,

            message:"Maintenance request rejected."

        });



    }
    catch(err){

        console.error(err);


        res.status(500).json({

            success:false,

            message:"Failed to reject request."

        });

    }


});







/*
=========================================
RESOLVE REQUEST
=========================================
*/

router.put("/:id/resolve", requireAuth, (req,res)=>{

    try {


        const request = db.prepare(`

            SELECT *
            FROM maintenance_requests
            WHERE id=?

        `).get(req.params.id);



        if(!request){

            return res.status(404).json({

                success:false,

                message:"Request not found."

            });

        }




        db.prepare(`

            UPDATE maintenance_requests

            SET
                status='resolved',
                resolved_at=CURRENT_TIMESTAMP

            WHERE id=?

        `).run(req.params.id);





        db.prepare(`

            UPDATE assets

            SET status='available'

            WHERE id=?

        `).run(request.asset_id);





        res.json({

            success:true,

            message:"Maintenance request resolved."

        });



    }
    catch(err){

        console.error(err);



        res.status(500).json({

            success:false,

            message:"Failed to resolve request."

        });

    }


});



export default router;