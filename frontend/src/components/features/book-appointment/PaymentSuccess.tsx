import { useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Home } from "lucide-react";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";

export const PaymentSuccess = () => {
    const { t } = useTranslation("book");
    const navigate = useNavigate();

    return (
        <div className="bg-background py-8 sm:py-12 md:py-16 lg:py-20 flex items-center justify-center min-h-screen">
            <div className="max-w-lg w-full px-4 sm:px-6">
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-6 sm:p-8 md:p-12 text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15 text-green-600" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                        {t("book:paymentSuccessful")}
                    </h1>

                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                        {t("book:appointmentConfirmed")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button
                            onClick={() => navigate("/appointments")}
                            className="w-full sm:w-auto gap-2"
                        >
                            <Calendar size={18} />
                            {t("book:viewMyAppointments")}
                        </Button>

                        <Button
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto gap-2 bg-secondary"
                        >
                            <Home size={18} />
                            {t("book:backToHome")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};