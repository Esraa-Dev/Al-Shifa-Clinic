import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import { connectCloudinary } from "./config/cloudinary.js";
import i18n from "./config/i18n.js";
import morgan from "morgan";
import helmet from "helmet";
import * as i18nextMiddleware from "i18next-http-middleware";
import authRouter from "./routes/auth.js";
import doctorRouter from "./routes/doctor.js";
import appointmentRouter from "./routes/appointment.js";
import departmentRouter from "./routes/department.js";
import patientRouter from "./routes/patient.js";
import contactRoutes from "./routes/contact.js";
import statsRoutes from "./routes/stats.js";
import adminRoutes from "./routes/admin.js";
import notificationRoutes from "./routes/notification.js";
import ratingRoutes from "./routes/rating.js";
import prescriptionRoutes from "./routes/prescription.js";

import { stripeWebhook } from "./controllers/appointmentController.js";
import bodyParser from "body-parser";
import { runAdminSeed } from "./utils/adminSeed.js";

dotenv.config();
connectDb();
connectCloudinary();

const app = express();
const server = createServer(app);

app.post(
  "/api/v1/webhooks/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(morgan("dev"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(i18nextMiddleware.handle(i18n));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/ratings", ratingRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);

app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("identify", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
    io.emit("get-online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("subscribe-notifications", (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on("unsubscribe-notifications", (userId) => {
    socket.leave(`user:${userId}`);
  });

  socket.on("notification-read", ({ notificationId, userId }) => {
    io.to(`user:${userId}`).emit("notification-read", { notificationId });
  });

  socket.on("start-call", (data) => {
    const patientSocketId = onlineUsers.get(data.patientId);
    if (patientSocketId) {
      io.to(patientSocketId).emit("incoming-call", {
        roomId: data.roomId,
        doctorName: data.doctorName,
        type: data.type,
      });
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("get-online-users", Array.from(onlineUsers.keys()));
  });
});

export const sendNotification = (userId: string, notification: any) => {
  io.to(`user:${userId}`).emit("new-notification", notification);
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(` Server running on port ${PORT}`);
  try {
    await runAdminSeed();
  } catch (err) {
    console.error("Seed error:", err);
  }
});
