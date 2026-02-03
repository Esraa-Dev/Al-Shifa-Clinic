import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_LINKS } from "../constants/constants";
import { useAuth } from "../context/AuthContext";

export const NavLinks = () => {
  const { t } = useTranslation(["layout"]);
  const { user } = useAuth();

  const isPatient = user?.role === "patient";

  return (
    <ul className="hidden lg:flex items-center lg:space-x-4 xl:space-x-8 shrink-0">
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

      {isPatient && (
        <>
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
        </>
      )}
    </ul>
  );
};