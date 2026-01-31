import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/verify.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getNotifications);
router.patch("/:id/read", validateObjectId(), markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", validateObjectId(), deleteNotification);
router.get("/unread-count", getUnreadCount);

export default router;