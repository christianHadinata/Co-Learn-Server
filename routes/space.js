import express from "express";
import { getAllSpaces, getSingleSpace } from "../controllers/space.js";

const router = express.Router();

//localhost:5000/api/v1/spaces
router.post("/spaces", getAllSpaces);

//localhost:5000/api/v1/spaces/{learning_space_id}
router.get("/spaces/:learning_space_id", getSingleSpace);

export default router;