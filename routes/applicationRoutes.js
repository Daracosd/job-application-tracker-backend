const express= require("express");
const db= require("../config/db");
const authMiddleware= require("../middleware/authMiddleware");

const router= express.Router();

router.post("/", authMiddleware, (req,res) => {
    const{
        company,
        position,
        location,
        job_url,
        salary,
        date_applied,
        status,
        notes

    } =req.body;

    const sql= `
        INSERT INTO applications
        (company, position, location, job_url, salary, date_applied, status, notes, user_id)
        VALUES (?,?,?,?,?,?,?,?,?)
    
    `;
    const values= [
        company,
        position,
        location,
        job_url,
        salary,
        date_applied,
        status,
        notes,
        req.user.id
    ];

    db.query(sql, values, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                error: "Failed to create application"
            })
        }
        res.status(201).json ({
            message: "Application created successfully",
            id: result.insertId
        });
    });
});

router.get("/", authMiddleware, (req, res) => {
    const sql= "Select * FROM applications WHERE user_id=?";

    db.query(sql, [req.user.id], (err, results) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch applications"
            }); 
        }
        res.json(results);
    });
});

router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const {
        company,
        position,
        location,
        job_url,
        salary,
        date_applied,
        status,
        notes

    }= req.body;

    const sql= `
        UPDATE applications
        SET company=?,
            position=?,
            location=?,
            job_url=?,
            salary=?,
            date_applied=?,
            status=?,
            notes=?
        WHERE id=? AND user_id=?  
    `;
    const values=[
        company,
        position,
        location,
        job_url,
        salary,
        date_applied,
        status,
        notes,
        id,
        req.user.id
    ];
    db.query(sql, values, (err,result) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                error: "Failed to update application"
            });
        }

        if(result.affectedRows === 0){
            console.error(err);
            return res.status(404).json({
                error:   "Application not found or you do not have permission to update it"
            });
        }
        res.json({
            message: "Application updated successful"
        });
    });

});

router.delete("/:id", authMiddleware, (req,res) => {
    const {id} = req.params;

    const sql= "DELETE FROM applications WHERE id=? AND user_id=?";

    db.query(sql, [id, req.user.id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                error: "Failed to delete application"
            });

        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                error: "Application not found or you do not have permission to delete it"
            })
        }

        res.json({
            message: "Application deleted successfully"
        });
    });
});

module.exports =router;