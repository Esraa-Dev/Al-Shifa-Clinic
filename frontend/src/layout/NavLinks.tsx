import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_LINKS } from "../constants/constants";
import { useAuth } from "../context/AuthContext";

export const NavLinks = () => {
  const { t } = useTranslation(["layout"]);
  const { user } = useAuth();

  return (
    <ul className="hidden lg:flex items-center space-x-8">
      {NAV_LINKS.map((link) => (
        <li key={link.href}>
          <NavLink
            to={link.href}
            className={({ isActive }) =>
              `text-[15px] font-bold ${isActive
                ? "text-primary"
                : "text-primaryText hover:text-secondary"
              }`
            }
          >
            {t(`layout:nav.${link.translationKey}`)}
          </NavLink>
        </li>
      ))}

      {user?.role === "patient" && (
        <li>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `text-[15px] font-bold ${isActive
                ? "text-primary"
                : "text-primaryText hover:text-secondary"
              }`
            }
          >
            {t("layout:nav.appointments")}
          </NavLink>
        </li>
      )}
    </ul>
  );
};
