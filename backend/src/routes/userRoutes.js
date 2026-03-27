import express from "express";
import multer from "multer";
import path from "path";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/"); 
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }); 
router.post("/register", upload.single("image"), registerUser); 

export default router;