import { Request, Response } from "express";
import { Contact, validateSendMessage } from "../models/ContactSchema";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import {
  sendEmail,
  contactMessageContent,
  contactConfirmationContent,
} from "../utils/email";

export const createContactMessage = AsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(req.t("common:unauthorized"), 401);
    }

    const { error, value } = validateSendMessage(req.t).validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      throw new ApiError(req.t("common:validationFailed"), 400, messages);
    }

    const contact = new Contact({
      ...value,
      user: req.user._id,
    });

    const savedContact = await contact.save();

    try {
      const adminContent = await contactMessageContent(
        value.name,
        value.email,
        value.phone,
        value.subject,
        value.message,
        "en",
      );

      await sendEmail({
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: `New Contact Message: ${value.subject}`,
        mailgenContent: adminContent,
        language: "en",
      });

      const userLanguage = req.language || "en";
      const userConfirmationContent = await contactConfirmationContent(
        value.name,
        userLanguage,
      );

      await sendEmail({
        email: value.email,
        subject: req.t("contact:confirmationSubject"),
        mailgenContent: userConfirmationContent,
        language: userLanguage,
      });
    } catch (emailError) {
      console.error("Failed to send contact emails:", emailError);
    }

    res
      .status(201)
      .json(new ApiResponse(req.t("common:success"), savedContact, 201));
  },
);
