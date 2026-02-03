import { useState } from "react";
import { Outlet } from "react-router-dom";
import {DashboardSidebar} from "./DashboardSidebar";
import {DashboardHeader} from "./DashboardHeader";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background" dir="ltr">
      <DashboardSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          toggleMobile={() => setIsMobileOpen(!isMobileOpen)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;