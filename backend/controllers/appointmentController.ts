
import { Request, Response } from "express";
import {
  Appointment,
  validateBookAppointment,
  validateBookedSlots,
  validateUpdateAppointmentStatus,
} from "../models/AppointmentSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Doctor } from "../models/DoctorSchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { AgoraService } from "../services/agoraService.js";
import { ZegoService } from "../services/ZegoService.js";

export const getPatientAppointments = AsyncHandler(
  async (req: Request, res: Response) => {
    const patientId = req.user?._id;
    const { status } = req.query;
    const filter: any = { patientId: patientId };

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization image",
      })
      .sort({ appointmentDate: -1, startTime: -1 });

    res
      .status(200)
      .json(
        new ApiResponse("Appointments fetched successfully", appointments, 200)
      );
  }
);

export const bookAppointment = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error, value } = validateBookAppointment.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError("Validation failed", 400, messages);
    }

    const patientId = req.user?._id;
    const { doctorId } = req.params;
    const { appointmentDate, startTime, endTime, type, fee, symptoms } = value;

    const appointmentDateTime = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDateTime < today) {
      throw new ApiError("Cannot book appointments in the past", 400);
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError("Doctor not found", 404);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: appointmentDateTime,
      status: { $in: ["Scheduled", "In Progress"] },
      startTime,
    });

    if (existingAppointment) {
      throw new ApiError("Time slot already booked for this doctor", 400);
    }

    let roomId;
    if (type === "video") {
      roomId = `appointment_${new mongoose.Types.ObjectId()}_${Date.now()}`;
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: appointmentDateTime,
      startTime,
      endTime,
      type,
      fee,
      symptoms,
      roomId,
      status: "Scheduled",
      paymentStatus: "pending",
    });

    await newAppointment.save();

    const fullDetails = await Appointment.findById(newAppointment._id)
      .populate("doctorId", "name specialization profileImage")
      .populate("patientId", "name email profileImage");

    res
      .status(201)
      .json(
        new ApiResponse("Appointment booked successfully", fullDetails, 201)
      );
  }
);

export const getBookedSlots = AsyncHandler(
  async (req: Request, res: Response) => {
    const { value, error } = validateBookedSlots.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError("Validation failed", 400, messages);
    }

    const { doctorId, date } = value;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["Scheduled", "In Progress"] },
    }).select("startTime -_id");

    const bookedSlots = bookedAppointments.map((apt) => apt.startTime);
    res
      .status(200)
      .json(new ApiResponse("Booked slots fetched", bookedSlots, 200));
  }
);

export const getDoctorAppointments = AsyncHandler(
  async (req: Request, res: Response) => {
    const doctorId = req.user?._id;
    const { status } = req.query;
    const filter: any = { doctorId: doctorId };

    if (status) {
      const statusArr = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArr };
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "patientId",
        select: "firstName lastName email phone image",
      })
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization fee image",
      })
      .sort({ appointmentDate: 1, startTime: 1 });

    res
      .status(200)
      .json(
        new ApiResponse(
          "Doctor appointments fetched successfully",
          appointments,
          200
        )
      );
  }
);

export const updateAppointmentStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error, value } = validateUpdateAppointmentStatus.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError("Validation failed", 400, messages);
    }

    const { id } = req.params;
    const { status } = value;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new ApiError("Appointment not found", 404);
    }

    const doctorId = req.user?._id;
    if (doctorId?.toString() !== appointment.doctorId.toString()) {
      throw new ApiError("Unauthorized to update this appointment", 403);
    }

    appointment.status = status;

    if (status === "Completed" && appointment.paymentStatus === "pending") {
      appointment.paymentStatus = "paid";
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate("patientId", "firstName lastName email phone image")
      .populate("doctorId", "firstName lastName specialization fee image");

    res
      .status(200)
      .json(
        new ApiResponse(
          "Appointment status updated successfully",
          updatedAppointment,
          200
        )
      );
  }
);

export const startVideoConsultation = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const doctorId = req.user?._id;

    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'firstName lastName email')
      .populate('patientId', 'firstName lastName email');
    
    if (!appointment) {
      throw new ApiError("Appointment not found", 404);
    }

    // Check if doctor is authorized
    if (appointment.doctorId._id.toString() !== doctorId?.toString()) {
      throw new ApiError("Unauthorized to start this consultation", 403);
    }

    // OPTIONAL: Add time validation back if needed
    // const today = new Date();
    // const appointmentDate = new Date(appointment.appointmentDate);
    // if (appointmentDate.toDateString() !== today.toDateString()) {
    //   throw new ApiError("Can only start consultations scheduled for today", 400);
    // }

    // Update appointment status
    appointment.status = "In Progress";
    
    // Generate room ID if not exists
    if (!appointment.roomId) {
      appointment.roomId = `room_${appointment._id}_${Date.now()}`;
    }
    
    await appointment.save();

    // Generate Zego token for doctor
    const doctorUserId = `doctor_${doctorId}`;
    const zegoToken = ZegoService.generateToken(doctorUserId, appointment.roomId);

    res.status(200).json(
      new ApiResponse(
        "Video consultation started successfully",
        {
          appointmentId: appointment._id,
          roomId: appointment.roomId,
          zego: {
            appId: zegoToken.appId,
            token: zegoToken.token,
            roomId: zegoToken.roomId,
            userId: zegoToken.userId,
            userName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
          },
          userType: 'doctor',
          appointmentDetails: {
            doctorName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
            patientName: `${appointment.patientId.firstName} ${appointment.patientId.lastName}`,
            appointmentDate: appointment.appointmentDate,
            startTime: appointment.startTime,
            endTime: appointment.endTime
          }
        },
        200
      )
    );
  }
);
export const joinVideoConsultation = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.user || !req.user._id) {
      throw new ApiError("User not authenticated", 401);
    }
    
    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'firstName lastName email')
      .populate('patientId', 'firstName lastName email');
    
    if (!appointment) {
      throw new ApiError("Appointment not found", 404);
    }
    
    const isDoctor = appointment.doctorId && 
                     appointment.doctorId._id.toString() === req.user._id.toString();
    const isPatient = appointment.patientId && 
                      appointment.patientId._id.toString() === req.user._id.toString();
    
    if (!isDoctor && !isPatient) {
      throw new ApiError("Not authorized to join this consultation", 403);
    }
    
    if (appointment.status !== "In Progress") {
      throw new ApiError("Consultation has not started yet", 400);
    }
    
    if (appointment.type !== "video") {
      throw new ApiError("This appointment is not a video consultation", 400);
    }
    
    if (!appointment.roomId) {
      throw new ApiError("Video room not available", 400);
    }
    
    // Generate Zego token based on user
    const userId = isDoctor ? 'doctor_' + req.user._id : 'patient_' + req.user._id;
    const zegoToken = ZegoService.generateToken(userId, appointment.roomId);
   // In joinVideoConsultation function, update the response:
res.status(200).json(
  new ApiResponse("Joining video consultation", {
    appointmentId: appointment._id,
    roomId: appointment.roomId,
    zego: {
      appId: zegoToken.appId,
      token: zegoToken.token,
      roomId: zegoToken.roomId,
      userId: zegoToken.userId,
      userName: isDoctor 
        ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
        : `${appointment.patientId.firstName} ${appointment.patientId.lastName}`
    },
    userType: isDoctor ? 'doctor' : 'patient',
    appointmentDetails: {
      doctorName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
      patientName: `${appointment.patientId.firstName} ${appointment.patientId.lastName}`,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime
    }
  }, 200)
);
  } catch (error) {
    console.error("Error in joinVideoConsultation:", error);
    throw error;
  }
});
