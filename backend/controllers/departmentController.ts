import { Request, Response } from "express";
import { Department } from "../models/DepartmentSchema.js";
import User from "../models/UserSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const id = req.user?._id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { name, description, isActive } = req.body;
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const newDepartment = await Department.create({
      name,
      description,
      icon: image.path,
      isActive,
    });
    res.status(201).json({
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating department", error });
  }
};

export const getAllDepartments = AsyncHandler(
  async (_req: Request, res: Response) => {
    const departments = await Department.find({ isActive: true })

    res.status(200).json(
      new ApiResponse("Departments retrieved successfully", departments, 200)
    );
  }
);


export const getDepartmentCount = async (req: Request, res: Response) => {
  try {
    const count = await Department.countDocuments();
    res
      .status(200)
      .json({ message: "Department count fetched successfully", count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error });
  }
};
