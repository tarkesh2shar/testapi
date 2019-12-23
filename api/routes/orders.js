const express = require("express");


const router=express.Router();

const Order=require ('../models/orders');

const mongoose=require("mongoose")
const Product=require("../models/product");

const checkAuth=require("../middleware/checkAuth");


router.get("/", checkAuth,(req,res,next)=>{

    Order.find({}).select("product quantity _id")
    .populate("product","name").exec().then(docs=>{
        res.status(200).json({
            count :docs.length,
            orders:docs.map(doc=>{
                return {
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:"GET",
                        url:"http://localhost:3000/orders"+doc._id
                    }
                }
            }),
          
        })
    })
    .catch(err=>{
        res.status(500).json(docs);
    })

   
});


router.post("/",checkAuth,(req,res,next)=>{

    console.log(req.body);
    console.log(req.query);

    Product.findById(req.body.productId)
    .then((product)=>{

        if(!product){
            return  new Error("Not Found");
        }

        const order =new Order({

            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productId
    
        });

        return order.save()
    


    }).then(result=>{
        console.log(result);
      

        res.status(201).json({
            message:"Orders were posted",
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                type:"GET",
                url:"http://localhost:3000/orders"+result._id
            }
        });
        
    }) .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
        
    
    

   


});


router.get("/:id",checkAuth,(req,res,next)=>{

    res.status(200).json({
        message:"Orders details",
        id:req.params.id
    });
});


router.delete("/:id",(req,res,next)=>{

    res.status(200).json({
        message:"Orders deleted",
        id:req.params.id
    });
});





module.exports =router;