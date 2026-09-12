const express= require("express");
const bcrypt=require("bcrypt");
const db=require("../config/db");
const jwt=require("jsonwebtoken");
const router =express.Router();

router.post("/register", async(req, res) =>{
    const {name,email,password} =req.body;

    if(!name|| !email|| !password){
        return res.status(400).json({
            error: "Name, Email, Password are required"
        });
    }

    try{
        const hashedPassword =await bcrypt.hash(password,10);

        const sql=`
            INSERT INTO users (name, email, password)
            VALUES(?, ?, ?)    
        `;

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {
                if(err){
                    console.error(err);

                    if(err.code === "ER_DUP_ENTRY"){
                        return res.status(409).json({
                            error: "Email already exists"
                        });
                    }

                    return res.status(500).json({
                        error: "Failed to create user"
                    });
                }
                res.status(201).json({
                    message: "User registered successfully",
                    id: result.insertId
                });
            }
        );
    } catch(error){
        console.error(error);

        res.status(500).json({
            error: "Failed to register user"
        });
    }
});

router.post("/login", async (req,res)=>{
    const{email, password}=req.body;

    if(!email || !password){
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try{
        const sql="SELECT * FROM users WHERE email=?";

        db.query(sql, [email], async (err, results) =>{
            if(err){
                console.error(err)
                return res.status(500).json({
                    error: "Failed to login"
                });
            }

            if(results.length === 0){
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const user=results[0];

            const passwordMatch= await bcrypt.compare(
                password,
                user.password
            );


            if(!passwordMatch){
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const token= jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );


            res.json({
                message: "Login successful",
                token: token,
                user: {
                    id:user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    } catch (error){
        console.error(error);

        res.status(500).json({
            error: "Failed to login"
        });
    }
});
module.exports=router;