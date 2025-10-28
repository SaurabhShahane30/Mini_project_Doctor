import express from "express";
import { signup, signin, requireAuth, getPatientProfile, getAllPatients, addDoctor, removeDoctor } from "../controllers/PatientControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/all", getAllPatients);
router.get('/', requireAuth, getPatientProfile);
router.post("/addDoctor/:patientId/:doctorId", addDoctor);
router.post("/removeDoctor/:patientId/:doctorId", removeDoctor);

export default router;
