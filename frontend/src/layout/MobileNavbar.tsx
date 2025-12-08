import { NavLink } from "react-router-dom";
import { NAV_LINKs } from "../constants/navigation";
import { Button } from "../components/ui/Button";

export const MobileNavbar = () => {
  return (
    <div className="lg:hidden shadow-md mt-6 container transition-all">
      <div className="border-t border-primaryBorder">
        {NAV_LINKs.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              `block py-3 px-4 text-center rounded-xl font-semibold tracking-wide transition-all duration-300 ${isActive
                ? "text-primary bg-primary/10 shadow-sm scale-[1.02]"
                : "text-secondary hover:text-primary hover:bg-gray-50"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="flex-center flex-col gap-2">
        <Button className="py-3 px-3 sm:px-20 w-full sm:w-fit">
          تسجيل دخول
        </Button>
        <Button className="py-3 px-3 sm:px-20 w-full sm:w-fit bg-secondary hover:bg-secondary/80">
          إنشاء حساب
        </Button>
      </div>
    </div>
  );
};

export default MobileNavbar;
