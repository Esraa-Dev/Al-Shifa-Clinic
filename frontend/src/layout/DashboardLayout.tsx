import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex" dir="ltr">
      <DashboardSidebar sidebarOpen={sidebarOpen} />
      <div className="flex-1">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <DashboardMain><Outlet /></DashboardMain>
      </div>
    </div>
  );
};

export default DashboardLayout;
