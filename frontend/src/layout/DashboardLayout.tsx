import { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import { Outlet } from "react-router-dom";
import i18n from "../i18n";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    i18n.changeLanguage("en");
  }, []);
  
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
