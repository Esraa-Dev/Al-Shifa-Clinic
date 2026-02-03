import { Bell, ChevronDown, Clock, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import { useMarkNotificationAsRead } from "../hooks/notifications/useMarkNotificationAsRead";
import { useUnreadCount } from "../hooks/notifications/useUnreadCount";
import { useNotifications } from "../hooks/notifications/useNotifications";
import type { Notification } from "../types/types";
import { useMarkAllAsRead } from "../hooks/notifications/useMarkAllAsRead";

const NotificationBtn = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: unreadData, refetch: refetchUnread } = useUnreadCount();
  const { data: notificationsData, refetch: refetchNotifications } = useNotifications({ page: 1, limit: 5 });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { user, isAuthenticated } = useAuth();
  const socket = useSocket();
  const { t,i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = unreadData?.data?.count || 0;
  const notifications = notificationsData?.data?.notifications || [];

  const shouldShowNotifications = isAuthenticated && user && 
    (user.role === "patient" || user.role === "doctor" || user.role === "admin");

  useEffect(() => {
    if (!socket || !user || !shouldShowNotifications) return;

    socket.emit("subscribe-notifications", user._id);

    const handleNewNotification = () => {
      refetchUnread();
      refetchNotifications();

      const sound = new Audio('/notification.mp3');
      sound.play().catch(e => {
        console.log("Autoplay blocked:", e);
      });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
      socket.emit("unsubscribe-notifications", user._id);
    };
  }, [socket, user, refetchUnread, refetchNotifications, shouldShowNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!shouldShowNotifications) {
    return null;
  }

  const getNotificationsLink = () => {
    if (user?.role === "doctor") return "/doctor/notifications";
    if (user?.role === "admin") return "/admin/notifications";
    return "/notifications";
  };

  return (
    <div className={`relative`} ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative border cursor-pointer border-gray-200 bg-white transition-all rounded-full p-2 hover:bg-gray-100 flex items-center justify-center group"
        aria-label={t("notification:title")}
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className={`absolute -top-3 ${i18n.language === "en" ?"-right-1":"-left-1"}  w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center border-2 border-white`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`ml-1 text-gray-400 transition-all duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute ${i18n.language === "en" ?"right-0":"left-0"} mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in duration-200`}
        >
          <div className="p-4 border-b border-primaryBorder">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-primaryText">{t("notification:title")}</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={14} />
                    {t("notification:markAllRead")}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>{t("notification:noNotifications")}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification: Notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50" : ""
                      }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
                        <Bell />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-primaryText truncate">
                            {notification.title}
                          </h4>
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification._id);
                                }}
                                className="text-xs flex gap-1 cursor-pointer text-primary p-1 rounded hover:bg-secondary/20"
                                title={t("notification:markAsRead")}
                              >
                                <Check size={12} /> {t("notification:markAsRead")}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          {!notification.isRead && (
                            <span className="ml-auto bg-primary text-white px-2 py-0.5 rounded-full text-xs">
                              {t("notification:new")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-primaryBorder bg-gray-50">
            <Link
              to={getNotificationsLink()}
              className="block text-center text-primary hover:text-primary-dark font-medium py-2"
              onClick={() => setIsDropdownOpen(false)}
            >
              {t("notification:seeAll")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBtn;