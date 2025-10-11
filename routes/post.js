import express from "express";

import {
  createPost,
  getSinglePost,
  createComment,
  getAllComments,
  insertCommentVote,
  insertPostVote,
  getAnnotations,
  createAnnotations,
} from "../controllers/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

router.post("/create_post/:learning_space_id", authMiddleware, createPost);

router.get("/get_post/:post_id", optionalAuthMiddleware, getSinglePost);

router.post("/create_comment/:post_id", authMiddleware, createComment);

router.get("/get_comments/:post_id", optionalAuthMiddleware, getAllComments);

router.post("/vote_comment/:comment_id", authMiddleware, insertCommentVote);

router.post("/vote_post/:post_id", authMiddleware, insertPostVote);

// annotations
router.get("/annotations/:post_id", authMiddleware, getAnnotations);

router.post("/annotations/:post_id", authMiddleware, createAnnotations);

export default router;
