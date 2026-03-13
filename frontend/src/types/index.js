import express from "express"; 
import cors from "cors"; 
import {loginRoutes } from "./modules/login/login.routes.js"; 

const app = express() 

app.use(cors()); 
app.use(express.json()); 

app.user("/api/auth/login", loginRoutes); 

app.use(errorHandle); 

app.listen(prompt, () => { 
  console.log('Sever running on http://localhost:${PORT}')
})
