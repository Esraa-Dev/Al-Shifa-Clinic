import { useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Home } from "lucide-react";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";

export const PaymentSuccess = () => {
    const { t } = useTranslation("book");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="w-30 h-30 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-15 h-15 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("appointment:paymentSuccessful")}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {t("appointment:appointmentConfirmed")}
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <Button
                            onClick={() => navigate("/appointments")}
                            className="w-full gap-2"
                        >
                            <Calendar size={18} />
                            {t("appointment:viewMyAppointments")}
                        </Button>

                        <Button
                            onClick={() => navigate("/")}
                            className="w-full gap-2 bg-secondary"
                        >
                            <Home size={18} />
                            {t("appointment:backToHome")}
                        </Button>
                    </div>


                </div>
            </div>
        </div>
    );
};