import express from "express";
import {
  createRating,
  getDoctorRatings,
  getPatientRatings,
  deleteRating,
} from "../controllers/ratingController.js";
import { verifyToken, verifyPermission } from "../middlewares/verify.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { UserRole } from "../constants.js";

const router = express.Router();

router.post(
  "/appointment/:appointmentId",
  verifyToken,
  validateObjectId("appointmentId"),
  verifyPermission([UserRole.PATIENT]),
  createRating
);

router.get(
  "/doctor",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorRatings
);

router.get(
  "/patient",
  verifyToken,
  verifyPermission([UserRole.PATIENT]),
  getPatientRatings
);

router.delete(
  "/:id",
  verifyToken,
  validateObjectId(),
  verifyPermission([UserRole.PATIENT]),
  deleteRating
);

export default router;