import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import { MobileNavbar } from "./MobileNavbar";
import { NavLinks } from "./NavLinks";
import {useNavigate} from "react-router-dom"
export const Navbar = () => {
  const navigate=useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="py-6 bg-white">
      <div className="flex-center justify-between container flex-wrap gap-y-2">
        <Logo />
        <NavLinks />
        <Button className="hidden lg:flex bg-primary text-white hover:bg-primary/80"onClick={()=>navigate("/login")}>
          تسجيل دخول
        </Button>
        <button
          aria-label="Toggle Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex lg:hidden bg-secondary hover:bg-secondary/70 text-white w-9 h-9 cursor-pointer justify-center items-center rounded-sm border-white"
        >
          {!isMenuOpen ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>
      {isMenuOpen && <MobileNavbar />}
    </nav>
  );
};

