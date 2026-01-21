import React from "react";
import { STEPS } from "../../../constants/constants";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export const BookingSteps = ({ currentStep }: { currentStep: number }) => {
  const { t } = useTranslation("book");

  return (
    <div className="flex items-center justify-center mb-12 mx-12">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${currentStep >= step.number
                ? "bg-primary border-primary text-white shadow-lg shadow-orange-100"
                : "bg-white border-gray-200 text-gray-400"
                }`}
            >
              {currentStep > step.number ? (
                <Check className="w-6 h-6" strokeWidth={3} />
              ) : (
                <span className="font-bold">{step.number}</span>
              )}
            </div>
            <span className={`absolute -bottom-8 w-max text-sm font-medium transition-colors duration-300 ${currentStep >= step.number ? "text-primary" : "text-gray-400"
              }`}>
              {t(step.title)}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div className="w-full h-1 bg-gray-200 mx-4 relative rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ${currentStep > step.number ? "w-full" : "w-0"
                  }`}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};