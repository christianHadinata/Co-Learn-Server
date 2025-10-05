import express from "express";

import {
  createPost,
  getSinglePost,
  createComment,
  getAllComments,
} from "../controllers/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

router.post("/create_post/:learning_space_id", authMiddleware, createPost);

router.get("/get_post/:post_id", getSinglePost);

router.post("create_comment/:post_id", authMiddleware, createComment);

router.get("/get_comments/:post_id", getAllComments);

export default router;
