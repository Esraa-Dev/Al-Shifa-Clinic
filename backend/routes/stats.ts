import express from "express";
import { getHomeStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/home", getHomeStats);
export default router;