import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Star,
  UserCog,
  KeyRound,
  Bell,
} from "lucide-react";

export const SidebarMenu = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
    { icon: FileText, label: "Prescriptions", href: "/doctor/prescriptions" },
    { icon: Star, label: "Reviews", href: "/doctor/reviews" },
    { icon: UserCog, label: "Profile Settings", href: "/doctor/profile-settings" },
    { icon: KeyRound, label: "Change Password", href: "/doctor/change-password" },
    { icon: Bell, label: "Notifications", href: "/doctor/notifications" },
  ];

  return (
    <nav className="flex flex-col px-4 space-y-1">
      {menuItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={index}
            to={item.href}
            title={item.label}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              justify-start
              ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
              ${
                isActive
                  ? "bg-blue-50 text-secondary border border-blue-100 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-secondary"
              }
            `}
          >
            <Icon size={20} className="shrink-0" />
            <span
              className={`
                truncate
                lg:${isCollapsed ? "hidden" : "block"}
              `}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
