import express from "express";
import { signup, signin, requireAuth, getDoctorProfile, getAllDoctors } from "../controllers/UserControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/all", getAllDoctors);
router.get('/', requireAuth, getDoctorProfile);

export default router;
