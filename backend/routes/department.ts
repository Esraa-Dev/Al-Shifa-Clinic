import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentCount,
} from "../controllers/departmentController.js";
import { upload } from "../middlewares/multer.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.post(
  "/create-department",
  verifyToken,
  upload.single("image"),
  createDepartment
);
router.get("/", getAllDepartments);
router.get("/departments/count", getDepartmentCount);

export default router;
