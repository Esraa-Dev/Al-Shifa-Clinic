import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";
import { Logo } from "../components/ui/Logo";
import { useAuth } from "../context/AuthContext";

export const DashboardSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: {
  isCollapsed: boolean,
  setIsCollapsed: (value: boolean) => void,
  isMobileOpen: boolean,
  setIsMobileOpen: (value: boolean) => void
}) => {
  const { logout } = useAuth();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 z-50 bg-white border-r border-gray-200
        transition-all duration-300
        w-64
        ${isMobileOpen ? "left-0" : "-left-64"}
        lg:left-0 lg:static
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
      `}>
        <div className="flex flex-col h-full py-4 relative">

          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 lg:hidden"
            title="Close sidebar"
          >
            <X size={22} />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-10 bg-secondary text-white rounded-full p-1"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <div className={`px-6 mb-8 ${isCollapsed ? "justify-center" : ""}`}>
            <Logo hideText={isCollapsed} />
          </div>

          <div className="flex-1 overflow-y-auto">
            <SidebarMenu isCollapsed={isCollapsed} />
          </div>

          <div className="px-4 pt-4 border-t border-gray-100">
            <button
              onClick={logout}
              className={`flex items-center w-full gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl ${isCollapsed ? "justify-center" : ""
                }`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="text-sm font-semibold">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
