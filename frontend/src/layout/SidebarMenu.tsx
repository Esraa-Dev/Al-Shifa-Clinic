import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
} from "lucide-react";
export const SidebarMenu = () => {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "لوحة التحكم",
      href: "/dashboard",
      active: true,
    },
    { icon: Calendar, label: "المواعيد", href: "/doctor/appointments" },
  ];
  return (
    <nav className="flex flex-col mt-8">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) => {
              return `
                flex items-center gap-3 mx-4 my-2 px-2 py-2 rounded-md text-md font-medium transition-colors  ${
                  isActive
                    ? "text-secondary border border-primaryBorder shadow"
                    : "text-primaryText hover:text-secondary"
                }`;
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
