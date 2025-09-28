import express from "express";

import { createPost, getSinglePost } from "../controllers/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

router.post("/create_post/:learning_space_id", authMiddleware, createPost);

router.get("/get_post/:post_id", getSinglePost);

export default router;
