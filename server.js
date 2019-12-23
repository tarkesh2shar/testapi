const http=require('http');
const app=require('./app');
const mongoose =require("mongoose");


mongoose.connect("mongodb://localhost:27017/test",{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{

console.log("connected to mongo DB");

})




const port =process.env.PORT || 8080;


const server=http.createServer(app);



server.listen(port);


