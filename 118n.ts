import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    returnObjects: true,
    lng: "en",
    supportedLngs: ["en", "de"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ["localStorage", "cookie"],
      excludeCacheFor: ["cimode"],
      cookieMinutes: 10,
      cookieDomain: "",
    },
    resources: {
      en: {
        translation: {
          footerNav: [
            { id: 0, name: "login", link: "/login" },
            { id: 1, name: "features", link: "/features" },
            { id: 2, name: "learn more", link: "/learn-more" },
            { id: 3, name: "support", link: "/support" },
          ],
          headerNav: [
            { id: 0, name: "login", link: "/login" },
            { id: 1, name: "menu", link: "/" },
          ],
        },
      },
      de: {
        translation: {
          footerNav: [
            { id: 0, name: "login", link: "/login" },
            { id: 1, name: "Merkmale", link: "/merkmale" },
            { id: 2, name: "mehr erfahren", link: "/mehr-erfahren" },
            { id: 3, name: "Unterstützung", link: "/unterstützung" },
          ],
          headerNav: [
            { id: 0, name: "login", link: "/login" },
            { id: 1, name: "menu", link: "/" },
          ],
        },
      },
    },
  });

export default i18n;
