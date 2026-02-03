import express from "express";
import {
  bookAppointment,
  getBookedSlots,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
  startConsultation,
  getBookedDates,
  checkPaymentStatus,
  checkPaymentIntentStatus,
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
  getDoctorAppointments,
);
router.get(
  "/patient",
  verifyToken,
  verifyPermission([UserRole.PATIENT]),
  getPatientAppointments,
);
router.get("/booked-slots/:doctorId/:date", verifyToken, getBookedSlots);
router.get("/booked-dates/:doctorId", getBookedDates);

router.get("/:appointmentId/payment-status", verifyToken, checkPaymentStatus);

router.patch(
  "/:id/status",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  validateObjectId("id"),
  updateAppointmentStatus,
);
router.get(
  "/payment-intent/:paymentIntentId/status",
  verifyToken,
  checkPaymentIntentStatus,
);

router.post(
  "/:id/start-call",
  verifyToken,
  verifyPermission([UserRole.DOCTOR]),
  validateObjectId("id"),
  startConsultation,
);

export default router;