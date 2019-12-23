const express =require('express');
 const app=express();
 const productsRoutes=require("./api/routes/products");
 const ordersRoutes=require('./api/routes/orders');
 const userRoutes=require('./api/routes/user');
 const morgan =require("morgan");
 const bodyParser=require("body-parser")

 app.use(morgan("dev"))

 app.use("/uploads",express.static("uploads"))

 app.use(bodyParser.urlencoded({extended:false}));

 app.use(bodyParser.json());

 //Fixing CORS HERE//

 app.use((req,res,next)=>{

    res.header(
        "Access-Control-Allow-Origin","*"
    )
    res.header("Acess-Control-Allow-Headers",
    'Origin ,X-Requested-With,Content-Type,Accept,Authorization'
    );

    if(req.method==="OPTIONS"){
        
        res.header("Access-Control-Allow-Methods",
       "PUT,POST,PATCH,DELETE GET")
       
        return res.status(200).json({});
    }
    next()

    
    
 });



 app.use(

    //  (req,res,next)=>{
    //  res.status(200).json({
    //     message:"It works!"
    //  });

    "/products",productsRoutes,


 );
 app.use('/orders',ordersRoutes);

 app.use("/user",userRoutes);


 app.use((req,res,next)=>{

     const err=new Error("Not Found");
     err.status=404;
     next(err);

 })

 app.use((err,req,res,next)=>{
    res.status(err.status||500);
    res.json({
        err:{
            message:err.message
        }
    })
 });


 module.exports=app;