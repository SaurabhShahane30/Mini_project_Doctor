import express from "express";
import { signup, signin, requireAuth, getPatientProfile, getAllPatients } from "../controllers/PatientControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/all", getAllPatients);
router.get('/', requireAuth, getPatientProfile);

export default router;
