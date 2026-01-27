import express from "express";
import {
  updateDoctorProfile,
  getAllDoctors,
  getDoctorProfile,
  getDoctorById,
  getTopDoctors,
  getDoctorStats,
} from "../controllers/doctorController.js";
import { verifyPermission, verifyToken } from "../middlewares/verify.js";
import { UserRole } from "../constants.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/top", getTopDoctors);
router.get(
  "/stats",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorStats
);
router.get(
  "/profile",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorProfile
);
router.put(
  "/profile",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  updateDoctorProfile
);
router.get("/:id", getDoctorById);

export default router;