import express from "express";

import { createPost, getSinglePost } from "../controllers/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

router.post("/create_post", authMiddleware, createPost);

router.get("/get_post", authMiddleware, getSinglePost);

export default router;
