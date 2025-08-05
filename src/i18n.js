import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend) // loads translations from your server/public path
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: "en", // use en if detected lng is not available
    debug: true, // enable logging in development
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      // path where resources get loaded from
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    // you can whitelist supported languages here if needed
    supportedLngs: ['en', 'es', 'de', 'zh-TW', 'pt-BR', 'tr'],
  });

export default i18n;
