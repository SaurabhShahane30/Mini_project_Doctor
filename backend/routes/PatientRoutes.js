import express from "express";
import { signup, signin,getAllPatients } from "../controllers/PatientControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/", getAllPatients);


export default router;
