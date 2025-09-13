import express from "express";
import { register, login, getSingleUser } from "../controllers/user.js";

const router = express.Router();

//  localhost:5000/api/v1/users/register
router.post("/register", register);

//  localhost:5000/api/v1/users/login
router.post("/login", login);
// router.post("/logout", logout);

export default router;
