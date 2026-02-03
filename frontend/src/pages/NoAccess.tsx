import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NoAccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackClick = () => {
    if (user) {
      switch (user.role) {
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/");
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute -top-5 -right-5 w-70 h-70 rounded-full bg-primary/5"></div>
      <div className="absolute -bottom-5 -left-5 w-70 h-70 rounded-full bg-secondary/5"></div>

      <div className="text-center relative z-10">
        <h1 className="text-9xl font-black text-secondary mb-4">{t('common:noAccessPage.title')}</h1>
        <h2 className="text-2xl font-medium text-primaryText mb-6">{t('common:noAccessPage.subtitle')}</h2>
        <p className="text-gray-600 mb-8">
          {t('common:noAccessPage.description')}
        </p>
        <button
          onClick={handleBackClick}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/90"
        >
          {t('common:noAccessPage.backHome')}
        </button>
      </div>
    </div>
  );
};

export default NoAccess;