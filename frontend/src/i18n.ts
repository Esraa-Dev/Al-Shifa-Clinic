import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enHome from "./locales/en/home.json";
import arHome from "./locales/ar/home.json";
import enAbout from "./locales/en/about.json";
import arAbout from "./locales/ar/about.json";
import enContact from "./locales/en/contact.json";
import arContact from "./locales/ar/contact.json";
import enAuth from "./locales/en/auth.json";
import arAuth from "./locales/ar/auth.json";
import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";
import enOnboarding from "./locales/en/onboarding.json";
import arOnboarding from "./locales/ar/onboarding.json";
import enLayout from "./locales/en/layout.json";
import arLayout from "./locales/ar/layout.json";
import enValidation from "./locales/en/validation.json";
import arValidation from "./locales/ar/validation.json";
import enDoctorList from "./locales/en/doctorList.json";
import arDoctorList from "./locales/ar/doctorList.json";
import enDepartments from "./locales/en/departments.json";
import arDepartments from "./locales/ar/departments.json";
import enAppointment from "./locales/en/appointment.json";
import arAppointment from "./locales/ar/appointment.json";
import enBook from "./locales/en/book.json";
import arBook from "./locales/ar/book.json";
import enAppointments from "./locales/en/appointment.json";
import arAppointments from "./locales/ar/appointment.json";
import enProfile from "./locales/en/profile.json"; 
import arProfile from "./locales/ar/profile.json"; 

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        home: enHome,
        about: enAbout,
        contact: enContact,
        auth: enAuth,
        common: enCommon,
        onboarding: enOnboarding,
        layout: enLayout,
        validation: enValidation,
        doctorList: enDoctorList,
        departments: enDepartments,
        appointment: enAppointment,
        book: enBook,
        appointments: enAppointments,
        profile: enProfile, // Add this
      },
      ar: {
        home: arHome,
        about: arAbout,
        contact: arContact,
        auth: arAuth,
        common: arCommon,
        onboarding: arOnboarding,
        layout: arLayout,
        validation: arValidation,
        doctorList: arDoctorList,
        departments: arDepartments,
        appointment: arAppointment,
        book: arBook,
        appointments: arAppointments,
        profile: arProfile, 
      },
    },
    ns: [
      "home",
      "about",
      "contact",
      "auth",
      "common",
      "onboarding",
      "layout",
      "validation",
      "doctorList",
      "departments",
      "appointment",
      "appointments",
      "profile", 
    ],
    defaultNS: "home",
    lng: localStorage.getItem("i18nextLng") || "ar",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;