import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import { useMarkNotificationAsRead } from "../hooks/notifications/useMarkNotificationAsRead";
import { useMarkAllAsRead } from "../hooks/notifications/useMarkAllAsRead";
import { NotificationSkeleton } from "../components/features/dashboard/NotificationSkeleton";
import { useNotifications } from "../hooks/notifications/useNotifications";
import type { Notification } from "../types/types"
import { useAuth } from "../context/AuthContext";
const NotificationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useNotifications({
    page: currentPage,
    limit: 10,
  });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { t } = useTranslation();
  const { user } = useAuth();

  const notifications = data?.data?.notifications || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };

  useEffect(() => {
    refetch();
  }, [currentPage]);


  return (
    <div className={`space-y-6 ${user?.role === "patient" ? "container py-8":""}`} >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primaryText">
            {t("notification:title")}
          </h2>
          <p className="text-gray-600">
            {t("notification:subtitle")}
          </p>
        </div>
        <Button
          onClick={() => markAllAsRead()}
          disabled={notifications.length === 0 || notifications.every((notification: Notification) => notification.isRead)}
        >
          <Check size={16} className="mr-2" />
          {t("notification:markAllAsRead")}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-primaryBorder">
          <Bell className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-primary font-semibold">
            {t("notification:noNotifications")}
          </p>
        </div>

      ) : (
        <>
          <div className="space-y-4">
            {notifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`bg-white p-4 rounded-lg border border-primaryBorder ${!notification.isRead ? "border-l-4 border-l-primary" : ""
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
                      <Bell />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {format(new Date(notification.createdAt), "PPp")}
                        </span>
                        {!notification.isRead && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                            {t("notification:new")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-sm font-medium underline text-primary hover:text-primary-dark cursor-pointer"
                        title={t("notification:markAsRead")}
                      >
                        {t("notification:markAsRead")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default NotificationsPage;