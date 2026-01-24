import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageInitializer = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const currentLang = i18n.language;
        const isAr = currentLang === 'ar';

        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        document.documentElement.lang = isAr ? 'ar' : 'en';

        localStorage.setItem('i18nextLng', currentLang);
    }, [i18n.language]);

    return null;
};

export default LanguageInitializer;