import { Menu } from "lucide-react";
import NotificationBtn from "./NotificationBtn";
import { UserProfile } from "./UserProfile";

export const DashboardHeader = ({ toggleMobile }: any) => {
  return (
    <header className="h-18 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center">
        <button
          onClick={toggleMobile}
          aria-label="Toggle menu"

          className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationBtn />
        <UserProfile />
      </div>
    </header>
  );
};

