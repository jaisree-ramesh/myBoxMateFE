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
          homeText: [
            {
              title: "My Box Mate:\n Organize. Track. Relax.",
              text: "Never waste time searching again. My Box Mate is your ultimate solution for knowing exactly what you have and where it is, whether it's in a box in the attic or in your refrigerator.\n\n How does it work? Simple, fast, and smart.",
              button: [
                {
                  text: "Let´s organize",
                  link: "/organize",
                },
                {
                  text: "Tutorial",
                  link: "/tutorial",
                },
              ],
            },
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
          homeText: [
            {
              title: "My Box Mate:\n Organisieren. Verfolgen. Entspannen.",
              text: "Verschwenden Sie nie wieder Zeit mit Suchen. My Box Mate ist die ultimative Lösung, um genau zu wissen, was Sie haben und wo es sich befindet, egal ob in einer Kiste auf dem Dachboden oder in Ihrem Kühlschrank.\n\n Wie funktioniert es? Einfach, schnell und intelligent.",
              button: [
                {
                  id: 0,
                  text: "Lasst uns organisieren",
                  link: "/organize",
                },
                {
                  id: 1,
                  text: "Tutorial",
                  link: "/tutorial",
                },
              ],
            },
          ],
        },
      },
    },
  });

export default i18n;
