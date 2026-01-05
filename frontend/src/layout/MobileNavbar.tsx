import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { NAV_LINKs } from "../constants/navigation";
import { Button } from "../components/ui/Button";

interface MobileNavbarProps {
  isOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: any;
  isLoading: boolean;
  onLogout: () => void;
}

export const MobileNavbar = ({
  isOpen,
  setIsMenuOpen,
  user,
  isLoading,
  onLogout
}: MobileNavbarProps) => {
  const navigate = useNavigate();

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    handleNavClick();
    if (user?.role === "patient") {
      navigate("/profile");
    } else if (user?.role === "doctor") {
      navigate("/doctor/dashboard");
    } else if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div
      className={`lg:hidden pb-20 absolute shadow-2xl z-50 w-full left-0 right-0 top-full bg-white overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
    >
      <div className="absolute -top-30 -right-30 w-70 h-70 rounded-full bg-secondary/10 hidden sm:block"></div>
      <div className="absolute -bottom-20 -left-25 w-70 h-70 rounded-full bg-primary/10 hidden sm:block"></div>

      <div className="border-t border-primaryBorder pt-4 transition-opacity duration-300">
        {NAV_LINKs.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block py-3 px-4 text-center rounded-xl font-semibold tracking-wide transition-all duration-300 ${isActive ? "text-primary" : "text-secondary hover:text-primary"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {!isLoading && user ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-3 px-4 py-2">
            <img
              src={user.image}
              alt={user.firstName}
              className="w-12 h-12 rounded-full object-cover border border-primary/45"
            />
            <div className="text-right">
              <p className="font-medium text-sm text-primaryText">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 mt-4">
            <Button
              className="py-3 flex items-center justify-center gap-2"
              onClick={handleProfileClick}
            >
              <User size={16} />
              الملف الشخصي
            </Button>

            <Button
              className="py-3 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80"
              onClick={() => {
                handleNavClick();
                onLogout();
              }}
            >
              <LogOut size={16} />
              تسجيل خروج
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-center flex-col gap-2 container mt-4">
          <Button
            className="py-3 px-3 sm:px-20 w-full sm:w-fit"
            onClick={() => {
              navigate("/login");
              setIsMenuOpen(false);
            }}
          >
            تسجيل دخول
          </Button>
          <Button
            className="py-3 px-3 sm:px-20 w-full sm:w-fit bg-secondary hover:bg-secondary/80"
            onClick={() => {
              navigate("/register");
              setIsMenuOpen(false);
            }}
          >
            إنشاء حساب
          </Button>
        </div>
      )}
    </div>
  );
};