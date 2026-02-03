import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut, Globe } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import { changeLanguageUtils } from "../utils/language";
import type { MobileNavbarProps } from "../types/types";
import { NAV_LINKS } from "../constants/constants";

export const MobileNavbar = ({
  isOpen,
  setIsMenuOpen,
  user,
  isLoading,
  onLogout
}: MobileNavbarProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['auth', 'common', 'layout']);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    handleNavClick();
    if (user?.role === "patient") navigate("/profile");
  };

  const toggleLanguage = () => {
    changeLanguageUtils(i18n);
  };

  const isPatient = user?.role === "patient";

  return (
    <div
      className={`lg:hidden pb-8 absolute shadow-2xl z-50 w-full left-0 right-0 top-full bg-white overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
    >
      <div className="absolute -top-30 -right-30 w-70 h-70 rounded-full bg-secondary/10 hidden sm:block"></div>
      <div className="absolute -bottom-20 -left-25 w-70 h-70 -z-10 rounded-full bg-primary/10 hidden sm:block"></div>

      <div className="border-t border-primaryBorder pt-4">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${isActive ? "text-primary" : "text-secondary hover:text-primary"
              }`
            }
          >
            {t(`layout:nav.${link.translationKey}`)}
          </NavLink>
        ))}

        {isPatient && (
          <>
            <NavLink
              to="/appointments"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${isActive ? "text-primary" : "text-secondary hover:text-primary"
                }`
              }
            >
              {t("layout:nav.appointments")}
            </NavLink>

            <NavLink
              to="/notifications"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${isActive ? "text-primary" : "text-secondary hover:text-primary"
                }`
              }
            >
              {t("layout:nav.notifications")}
            </NavLink>
          </>
        )}
      </div>

      <div className="flex-center mt-4 px-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium text-sm">
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>

      {!isLoading && user ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-3 px-4 py-2">
            <img
              src={user.image}
              alt={user.firstName}
              className="w-12 h-12 rounded-full object-cover border border-primary/45"
            />
            <div>
              <p className="font-medium text-sm text-primaryText">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {isPatient && (
            <div className="flex flex-col gap-2 px-4 mt-4 container">
              <Button className="py-3 flex items-center justify-center gap-2" onClick={handleProfileClick}>
                <User size={16} />
                {t('common:profile')}
              </Button>

              <Button
                className="py-3 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80"
                onClick={() => {
                  handleNavClick();
                  onLogout();
                }}
              >
                <LogOut size={16} />
                {t('common:logout')}
              </Button>
            </div>
          )}
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
            {t('auth:login')}
          </Button>
        </div>
      )}
    </div>
  );
};