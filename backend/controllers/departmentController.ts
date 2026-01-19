import { Request, Response } from "express";
import { Department } from "../models/DepartmentSchema.js";
import User from "../models/UserSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import { cloudinaryUploadImage } from "../utils/cloudinary.js";
import { Doctor } from "../models/DoctorSchema.js";
import { getPaginationData } from "../utils/PaginationHelper.js";

export const createDepartment = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  
  if (!req.user) {
    throw new ApiError(t('common:unauthorized'), 401);
  }
  
  const id = req.user?._id;
  const user = await User.findById(id);
  
  if (!user) {
    throw new ApiError(t('common:userNotFound'), 404);
  }
  
  const { name_en, name_ar, description_en, description_ar, isActive = true } = req.body;
  
  if (!req.file) {
    throw new ApiError(t('validation:imageRequired'), 400);
  }
  
  let imageUrl = "";
  try {
    const result = await cloudinaryUploadImage(req.file.path);
    imageUrl = result.secure_url;
    
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw new ApiError(t('department:imageUploadFailed'), 500);
  }
  
  const newDepartment = await Department.create({
    name_en,
    name_ar,
    description_en,
    description_ar,
    icon: imageUrl,
    isActive,
  });
  
  const language = req.language || 'en';
  const localizedDepartment = {
    ...newDepartment.toObject(),
    name: language === 'ar' ? newDepartment.name_ar : newDepartment.name_en,
    description: language === 'ar' ? newDepartment.description_ar : newDepartment.description_en,
  };
  
  res.status(201).json(
    new ApiResponse(t('department:departmentCreated'), localizedDepartment, 201)
  );
});

export const getAllDepartments = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { page = 1, limit = 10, search = "" } = req.query;

    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name_en: { $regex: search, $options: "i" } },
        { name_ar: { $regex: search, $options: "i" } },
      ];
    }

    const totalItems = await Department.countDocuments(query);
    const pagination = getPaginationData(page, limit, totalItems);

    const departmentsData = await Department.find(query)
      .skip((pagination.currentPage - 1) * pagination.limit)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    const departments = await Promise.all(
      departmentsData.map(async (dept) => {
        const doctorCount = await Doctor.countDocuments({ 
          department: dept._id,
          isActive: true
        });
        
        return {
          ...dept.toObject(),
          doctorCount
        };
      })
    );

    res.status(200).json(
      new ApiResponse(
        t('department:departmentsRetrieved'),
        {
          departments,
          pagination,
        },
        200
      )
    );
  }
);

export const getDepartmentCount = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const count = await Department.countDocuments();
  res
    .status(200)
    .json(new ApiResponse(t('department:countFetched'), { count }, 200));
});

export const updateDepartment = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const { id } = req.params;
  
  if (!req.user) {
    throw new ApiError(t('common:unauthorized'), 401);
  }
  
  const { name_en, name_ar, description_en, description_ar, isActive } = req.body;
  
  const updateData: any = {
    name_en,
    name_ar,
    description_en,
    description_ar,
    isActive,
  };
  
  if (req.file) {
    try {
      const result = await cloudinaryUploadImage(req.file.path);
      updateData.icon = result.secure_url;
      
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (error) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      throw new ApiError(t('department:imageUploadFailed'), 500);
    }
  }
  
  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
  
  if (!updatedDepartment) {
    throw new ApiError(t('department:departmentNotFound'), 404);
  }
  
  const language = req.language || 'en';
  const localizedDepartment = {
    ...updatedDepartment.toObject(),
    name: language === 'ar' ? updatedDepartment.name_ar : updatedDepartment.name_en,
    description: language === 'ar' ? updatedDepartment.description_ar : updatedDepartment.description_en,
  };
  
  res.status(200).json(
    new ApiResponse(t('department:departmentUpdated'), localizedDepartment, 200)
  );
});

export const deleteDepartment = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const { id } = req.params;
  
  if (!req.user) {
    throw new ApiError(t('common:unauthorized'), 401);
  }
  
  const deletedDepartment = await Department.findByIdAndDelete(id);
  
  if (!deletedDepartment) {
    throw new ApiError(t('department:departmentNotFound'), 404);
  }
  
  res.status(200).json(
    new ApiResponse(t('department:departmentDeleted'), null, 200)
  );
});