import { useTranslation } from "react-i18next";

export const BookHeader = () => {
    const { t } = useTranslation();

    return (
        <div className="mb-8">
            <h2 className="text-lg md:text-4xl font-bold text-primaryText text-center">
                {t("book:bookAppointment.title")}
            </h2>
        </div>
    )
}