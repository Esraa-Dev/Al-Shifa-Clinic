import { useState } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";

import { MobileNavbar } from "./MobileNavbar";
import { NavLinks } from "./NavLinks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import LanguageSwitcher from "../components/features/LanguageSwitcher";
import { Logo } from "../components/ui/Logo";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <nav className={`py-6 relative shadow-md ${isMenuOpen ? "bg-background" : "bg-white"}`}>
      <div className="flex-center justify-between container flex-wrap h-10">
        <Logo />
        <NavLinks />
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {!isLoading && user ? (
            <div className="relative hidden lg:flex items-center gap-2 h-full">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer px-2 py-1 transition-colors"
              >
                <img
                  src={user.image}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover border border-primary/45"
                />
                <span className="font-medium text-sm text-primaryText">
                  {user.firstName} {user.lastName}
                </span>
                <ChevronDown size={16} className="font-medium text-primary" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute w-48 right-0 top-[calc(100%+10px)] bg-white border border-primaryBorder rounded-sm shadow-2xl z-50">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (user.role === "patient") {
                        navigate("/profile");
                      } else if (user.role === "doctor") {
                        navigate("/doctor/dashboard");
                      } else if (user.role === "admin") {
                        navigate("/admin/dashboard");
                      }
                    }}
                    className="flex items-center gap-2 text-xs p-4 font-medium text-primaryText border-b border-primary/50 w-full text-right cursor-pointer hover:bg-gray-50"
                  >
                    <User size={16} className="text-primary" />
                    الملف الشخصي
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-xs p-4 font-medium text-primaryText w-full text-right cursor-pointer hover:bg-gray-50"
                  >
                    <LogOut size={16} className="text-primary" />
                    تسجيل خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="hidden lg:flex"
              onClick={() => navigate("/login")}
            >
              تسجيل دخول
            </Button>
          )}
        </div>
        
        <button
          aria-label="Toggle Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex lg:hidden bg-secondary hover:bg-secondary/70 text-white w-9 h-9 cursor-pointer justify-center items-center rounded-sm border-white"
        >
          {!isMenuOpen ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <MobileNavbar
        isOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        isLoading={isLoading}
        onLogout={handleLogout}
      />
    </nav>
  );
};