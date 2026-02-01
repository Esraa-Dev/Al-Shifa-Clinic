import express from "express";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getPrescriptionByAppointmentId,
} from "../controllers/prescriptionController.js";
import { verifyToken, verifyPermission } from "../middlewares/verify.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { UserRole } from "../constants.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/appointment/:appointmentId",
  validateObjectId("appointmentId"),
  verifyPermission([UserRole.DOCTOR]),
  createPrescription
);

router.get(
  "/appointment/:appointmentId",
  validateObjectId("appointmentId"),
  verifyPermission([UserRole.DOCTOR, UserRole.PATIENT]),
  getPrescriptionByAppointmentId
);

router.get(
  "/",
  verifyPermission([UserRole.DOCTOR, UserRole.PATIENT]),
  getPrescriptions
);

router.get(
  "/:id",
  validateObjectId(),
  verifyPermission([UserRole.DOCTOR, UserRole.PATIENT]),
  getPrescriptionById
);

router.put(
  "/:id",
  validateObjectId(),
  verifyPermission([UserRole.DOCTOR]),
  updatePrescription
);

router.delete(
  "/:id",
  validateObjectId(),
  verifyPermission([UserRole.DOCTOR]),
  deletePrescription
);

export default router;