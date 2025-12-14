import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import { MobileNavbar } from "./MobileNavbar";
import { NavLinks } from "./NavLinks";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: user, isLoading } = useGetCurrentUser();
  console.log(user);
  return (
    <nav className="py-6 bg-white relative shadow-md">
      <div className="flex-center justify-between container flex-wrap gap-y-2 h-10">
        <Logo />
        <NavLinks />

        {!isLoading && user ? (
          <div className="relative flex items-center gap-2 h-full">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">{user.name}</span>
              <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full bg-white border border-primaryBorder rounded-md shadow-lg z-50">
                <button
                  onClick={() => navigate("/profile")}
                  className="text-xs px-4 py-2 font-medium text-primary border-b border-primaryBorder"
                >
                  الملف الشخصي
                </button>
                <button className="text-xs px-4 py-2 font-medium text-primary">
                  تسجيل خروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button className="hidden lg:flex" onClick={() => navigate("/login")}>
            تسجيل دخول
          </Button>
        )}

        <button
          aria-label="Toggle Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex lg:hidden bg-secondary hover:bg-secondary/70 text-white w-9 h-9 cursor-pointer justify-center items-center rounded-sm border-white"
        >
          {!isMenuOpen ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {isMenuOpen && <MobileNavbar isOpen={isMenuOpen} />}
    </nav>
  );
};
