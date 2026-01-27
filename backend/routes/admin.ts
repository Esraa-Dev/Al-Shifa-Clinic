import express from "express";
import { verifyToken, verifyPermission } from "../middlewares/verify.js";
import { getDashboardStats } from "../controllers/adminController.js";
import { UserRole } from "../constants.js";

const router = express.Router();

router.get("/stats", verifyToken, verifyPermission([UserRole.ADMIN]), getDashboardStats);

export default router;