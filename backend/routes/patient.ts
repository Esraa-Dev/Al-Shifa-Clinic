import express from "express";
import { getPatientProfile, updateProfileInfo } from "../controllers/patientController.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.get("/profile",verifyToken, getPatientProfile);
router.put("/profile",verifyToken, updateProfileInfo);


export default router;
