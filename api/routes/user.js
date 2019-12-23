const express = require("express");


 
const router=express.Router();

 
const User=require("../models/user");
const mongoose=require("mongoose");
const bycrpt =require("bcryptjs");

const jwt=require("jsonwebtoken");

router.post("/signup",(req,res,next)=>{



    bycrpt.hash(req.body.password,10,(err,hash)=>{

        if(err){
            return res.status(500).json({
                error:err
            })
        }
        else{


            new User({

                _id:new mongoose.Types.ObjectId(),
        
                email:req.body.email,
        
                password:hash
        
            }).save().then(result=>{
                console.log(result);
                
                res.status(201).json({
                    message:"User Created"
                })
            }).catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                })
                
            })



            
        }
    })


})

router.post("/login",(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then((user)=>{

        if(user.length<1){
            return res.status(401).json({
                message:"Auth Failed"
            });
        }

        bycrpt.compare(req.body.password,user[0].password,(err,isValid)=>{
            if(err){
                return res.status(401).json({
                    message:"Auth failed"
                })
            }
            if(isValid){

              const token=  jwt.sign({
                    email:user[0].email,userId:user[0]._id
                },"1234567890",{
                    expiresIn:"1h"
                })

                return res.status(200).json({
                    message:"Auth successfule",
                    token:token

                    //here is the way to create and send a web token 
                })

            }
            return res.status(401).json({
                message:"Auth failed"
            })
        })



    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
        
    });
})





module.exports=router;
