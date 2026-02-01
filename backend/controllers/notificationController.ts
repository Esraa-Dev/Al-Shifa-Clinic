import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/NotificationSchema.js";
import { getPaginationData } from "../utils/PaginationHelper.js";

export const getNotifications = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const userId = req.user?._id;
  const { page = 1, limit = 20 } = req.query;

  const filter = { userId };
  const totalItems = await Notification.countDocuments(filter);
  const pagination = getPaginationData(page, limit, totalItems);

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((pagination.currentPage - 1) * pagination.limit)
    .limit(pagination.limit);

  res.status(200).json(
    new ApiResponse(
      t("notification:notificationsFetched"), 
      { notifications, pagination }, 
      200
    )
  );
});

export const markAsRead = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const { id } = req.params;
  const userId = req.user?._id;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(t("notification:notificationNotFound"), 404);
  }

  res.status(200).json(
    new ApiResponse(
      t("notification:markedAsRead"), 
      notification, 
      200
    )
  );
});

export const markAllAsRead = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const userId = req.user?._id;

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  res.status(200).json(
    new ApiResponse(
      t("notification:allMarkedAsRead"), 
      null, 
      200
    )
  );
});

export const deleteNotification = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const { id } = req.params;
  const userId = req.user?._id;

  const notification = await Notification.findOneAndDelete({ _id: id, userId });

  if (!notification) {
    throw new ApiError(t("notification:notificationNotFound"), 404);
  }

  res.status(200).json(
    new ApiResponse(
      t("notification:notificationDeleted"), 
      null, 
      200
    )
  );
});

export const getUnreadCount = AsyncHandler(async (req: Request, res: Response) => {
  const t = req.t;
  const userId = req.user?._id;

  const count = await Notification.countDocuments({
    userId,
    isRead: false
  });

  res.status(200).json(
    new ApiResponse(
      t("notification:unreadCountFetched"), 
      { count }, 
      200
    )
  );
});