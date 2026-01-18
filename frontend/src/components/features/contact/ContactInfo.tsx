import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export const ContactInfo = ({
  methods,
  title,
  description
}: {
  methods: Array<{ icon: JSX.Element; title: string; details: string; description: string }>;
  title: string;
  description: string;
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-primaryText mb-4">{title}</h2>
        <p className="text-secondary text-lg">{description}</p>
      </div>

      <div className="space-y-6">
        {methods.map((method, index) => (
          <div key={index} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-primaryBorder">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              {method.icon}
            </div>
            <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
              <h3 className="font-bold text-primaryText text-lg">{method.title}</h3>
              <p className="text-primaryText">{method.details}</p>
              <p className="text-secondary text-sm">{method.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};