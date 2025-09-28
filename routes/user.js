import express from "express";
import {
  register,
  login,
  getSingleUser,
  updateUserProfile,
  updatePhoto,
  getViewUserProfile,
} from "../controllers/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

//  localhost:5000/api/v1/users/register
router.post("/register", register);

//  localhost:5000/api/v1/users/login
router.post("/login", login);

//localhost:5000/api/v1/users/
router.get("/", authMiddleware, getSingleUser);

//localhost:5000/api/v1/users/
router.get("/view_user_profile/:user_id", getViewUserProfile);

//localhost:5000/api/v1/users/profile
router.patch("/profile", authMiddleware, updateUserProfile);

//localhost:5000/api/v1/users/photo
router.patch("/photo", authMiddleware, fileUpload("./public"), updatePhoto);

export default router;
