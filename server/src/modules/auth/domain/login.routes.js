import express from "express"; 
import * as loginController from "./login.controller.js"
import { authMiddleware } from "../../../middleware/login.middleware.js"

const authRoutes = Router(); 

authRoutes.post("/login", authController.login)

export default router; 

