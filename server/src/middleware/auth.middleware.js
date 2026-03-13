import express from "express"; 

const app = express(); 

app.use(function(req,res,next) { 
    console.log("Request received"); 
    next()
}); 

app.get("/", function(req, res) { 
    res.send("Home page"); 
}); 

app.listen(3000); 