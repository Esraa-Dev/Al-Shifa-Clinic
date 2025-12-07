import logoImage from "../../assets/logo.png";

export const Logo = () => {
    return (
        <div className="flex items-center gap-2 ">
            <img src={logoImage} alt="Al Shifa Clinic Logo" className="w-10" />
            <h1 className="text-2xl font-bold text-secondary whitespace-nowrap">
                عيادة <span className="me-1 text-primary">الشفاء</span>
            </h1>
        </div>
    );
};
