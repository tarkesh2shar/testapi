const express = require("express");


 
const router=express.Router();


const Product=require("../models/product");
const mongoose=require("mongoose");

const checkAuth=require("../middleware/checkAuth");

const multer=require("multer");

const storage =multer.diskStorage({



    destination:function(req,file,cb){

        cb(null,"./uploads/")

    },
    filename:function(req,file,cb){

        cb(null,file.originalname);

    }
}

)

// const upload =multer({
//     dest:"uploads/",


// })

const fileFilters=(req,file,cb)=>{

    //reject a file 

    if(file.mimetype==="image/jpeg"||file.mimetype==="image/png"){
        cb(null,true);
    }
    else{
    cb(new Error("file type not supported"),false);
    }
   
}

const upload=multer({storage,fileFilter:fileFilters,limits:{
    fileSize:1024*1024*5
}})
const ObjectId=mongoose.Types.ObjectId;


router.get("/",(req,res,next)=>{

    Product.find().select("name price _id productImage").exec().then((docs)=>{
        
        console.log(docs);
        const responce={
            count:docs.length,
            products:docs.map((doc)=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:"http://localhost:8080/products/"+doc._id
                    }
                }
            })
         }
        res.status(200).json(responce);
        
    }).catch((err)=>{

        console.log(err);
        res.status(500).json({
            error:err
        })
        
    })

})


router.post("/",checkAuth,upload.single("productImage"),(req,res,next)=>{

    console.log(req.file);
    
    // const product={
    //     name:req.body.name,
    //     price:req.body.price
    // }

     const product= new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })

    product.save().then((result=>{
        console.log(result);


        
    res.status(200).json({
        message:"Created product Successfully",
        createdProduct:{
            name:result.name,
            price:result.price,
            _id:result._id,
            request:{
                type:"GET",
                url:"http://localhost:8080/products/"+result._id
            }

        }
    })
        
    })).catch(
        err=>{
            
            console.log(err)
            res.status(500).json({error:err})
        
        
        
    }
    )


})

router.get("/:id",(req,res,next)=>{
    
    const id=req.params.id;

    console.log(req.params);
    
    
    Product.findById(id)
    .select("name price _id")
    .exec()
    .then(
        
        (doc)=>{

            console.log(doc)

           doc? res.status(200).json(doc)
           :res.status(404).json({message:"No valid  entry for provided Id"})

        }



    )
    .catch(err=>{
        
        console.log(err);
        res.status(500).json({error:err})

    }
    )
});

router.patch("/:id",(req,res,next)=>{

    const updateOps={};

    for(const ops of req.body){

        updateOps[ops.propName]=ops.value;

    }

    Product.update(

        {_id:req.params.id},

        {$set:updateOps}
        
        ).exec()
        .then((result)=>{
            console.log(result);
            res.status(200).json({
                message:"Product updated",
                request:{
                    type:"GET",
                    url:"http://localhost:8080/products" +req.params.id
                }
            })
            
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
            
        })

 
});

router.delete("/:id",(req,res,next)=>{

    Product.deleteOne({_id:req.params.id}).exec().then((res)=>{

        res.status(200).json(res);
    }).catch((err)=>{

        res.status(500).json({
            error:err
        });

    })

   
});

module.exports=router;

