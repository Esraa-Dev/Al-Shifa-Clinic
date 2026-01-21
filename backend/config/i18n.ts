import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as i18nextMiddleware from "i18next-http-middleware";
import path from "path";
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "en",
    ns: ["common", "auth", "validation","email","user","doctor","department","appointment","contact","stats"],
    supportedLngs: ["ar", "en"],
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    backend: {
      loadPath: path.join(process.cwd(), "locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      order: ["header"],
    },
  });

export default i18next;
