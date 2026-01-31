import express from "express";
import {
  updateDoctorProfile,
  getAllDoctors,
  getDoctorProfile,
  getDoctorById,
  getTopDoctors,
  getDoctorStats,
  getDoctorProfileInfo,
  updateDoctorProfileInfo,
  updateDoctorProfileImage,
} from "../controllers/doctorController.js";
import { verifyPermission, verifyToken } from "../middlewares/verify.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { UserRole } from "../constants.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/top", getTopDoctors);
router.get(
  "/stats",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorStats,
);
router.get(
  "/profile",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorProfile,
);
router.put(
  "/profile",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  updateDoctorProfile,
);
router.get(
  "/profile/info",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorProfileInfo,
);
router.put(
  "/profile/info",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  updateDoctorProfileInfo,
);
router.put(
  "/profile/image",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  upload.single("image"),
  updateDoctorProfileImage,
);
router.get("/:id", validateObjectId(), getDoctorById);

export default router;