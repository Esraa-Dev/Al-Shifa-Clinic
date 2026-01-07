import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);

    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-primaryBorder rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-haspopup="true"
      >
        <Globe className="w-3 h-3 text-gray-600" />
        <span className="flex items-center gap-2">
          <span className="text-sm">{currentLang.flag}</span>
          <span className="font-medium text-gray-700 text-sm">{currentLang.name}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-lg bg-white border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 "
                aria-current={i18n.language === lang.code ? 'true' : 'false'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="font-medium text-sm text-gray-800">{lang.name}</span>
                </div>
                {i18n.language === lang.code && (
                  <Check className="w-3 h-3 text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;