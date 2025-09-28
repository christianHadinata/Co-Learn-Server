import express from "express";

import {
  createLearningSpace,
  getAllSpaces,
  getRelatedSpaces,
  getSingleSpace,
  createPost,
} from "../controllers/space.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

//localhost:5000/api/v1/spaces
router.get("/", getAllSpaces);

//localhost:5000/api/v1/spaces/related/{learning_space_id}
router.get("/related/:learning_space_id", getRelatedSpaces);

//localhost:5000/api/v1/spaces/{learning_space_id}
router.get("/:learning_space_id", optionalAuthMiddleware, getSingleSpace);

//  localhost:5000/api/v1/spaces/create_learning_space
router.post(
  "/create_learning_space",
  authMiddleware,
  fileUpload("./public"),
  createLearningSpace
);

export default router;
