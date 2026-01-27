import type { DashboardMainProps } from "../types/Dashboard";

const DashboardMain = ({ children }: DashboardMainProps) => {
  return (
    <main className="bg-background h-full p-4">
        {children}
    </main>
  );
};

export default DashboardMain;