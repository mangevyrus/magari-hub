
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sw from "./locales/sw.json";
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem("magarihub_language");

i18n
    .use(initReactI18next)
    .init({
        resources: {
            sw: {
                translation: sw,
            },
            en: {
                translation: en,
            },
        },

        lng: savedLanguage || "sw",

        fallbackLng: "sw",

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
