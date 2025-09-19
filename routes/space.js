import express from "express";
import { create_learning_space, setPhoto } from "../controllers/space.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

//  localhost:5000/api/v1/space/create_learning_space
router.post("/create_learning_space", create_learning_space);

router.post("/space_picture", authMiddleware, fileUpload("./public"), setPhoto);

export default router;
