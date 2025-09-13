import express from "express";
import {
    getSingleUser,
    updateUserProfile,
    updatePhoto,
} from "../controllers/user.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {fileUpload} from "../middleware/fileUploader.js";

const router = express.Router();

//localhost:5000/api/v1/users/
router.get("/", authMiddleware, getSingleUser);

//localhost:5000/api/v1/users/profile
router.patch("/profile", authMiddleware, updateUserProfile);

//localhost:5000/api/v1/users/photo
router.patch("/photo", authMiddleware, fileUpload("./public"), updatePhoto);

export default router;