import express from "express";
import { signup, signin, getAllDoctors } from "../controllers/UserControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/all", getAllDoctors);

export default router;
