import express from "express";
import { createContactMessage } from "../controllers/contactController.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.post("/",verifyToken, createContactMessage);
export default router;