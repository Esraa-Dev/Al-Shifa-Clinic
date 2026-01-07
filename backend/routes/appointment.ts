import express from "express";
import {
  bookAppointment,
  getBookedSlots,
  getDoctorAppointments,
  getPatientAppointments,
  joinVideoConsultation,
  startVideoConsultation,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { verifyToken, verifyPermission } from "../middlewares/verify.js";
import { UserRole } from "../constants.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.post("/book/:doctorId", verifyToken, bookAppointment);
router.get(
  "/doctor",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  getDoctorAppointments
);
router.get(
  "/patient",
  verifyToken,
  verifyPermission([UserRole.PATIENT]),
  getPatientAppointments
);
router.get("/booked-slots/:doctorId/slots/:date", verifyToken, getBookedSlots);
router.patch(
  "/:id/status",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  validateObjectId("id"),
  updateAppointmentStatus
);
router.post(
  "/:id/start-video",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  validateObjectId("id"),
  startVideoConsultation
);
router.post(
  "/:id/join-video",
  verifyToken,
  validateObjectId("id"),
  joinVideoConsultation
);

export default router;