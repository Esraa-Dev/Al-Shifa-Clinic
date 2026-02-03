import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImage from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

export const Logo = ({ hideText = false }) => {
    const { t } = useTranslation('layout');
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        let path = "/";
        
        if (user) {
            switch (user.role) {
                case "doctor":
                    path = "/doctor/dashboard";
                    break;
                case "admin":
                    path = "/admin/dashboard";
                    break;
                case "patient":
                    path = "/"; 
                    break;
            }
        }
        
        navigate(path);
        window.scrollTo(0, 0); 
    };
    
    return (
        <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 focus:outline-none"
        >
            <img src={logoImage} alt="Al Shifa Clinic Logo" className="w-10" />
            {!hideText && (
                <h1 className="text-xl xl:text-2xl font-bold text-secondary whitespace-nowrap">
                    {t('layout:clinic.name')} <span className="me-1 text-primary">{t('layout:clinic.subname')}</span>
                </h1>
            )}
        </button>
    );
};