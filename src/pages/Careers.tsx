import React from "react";
import { useTranslation } from "react-i18next";

export default function Careers() {
  const { t } = useTranslation();

  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        {t("careers")}
      </h1>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("careers.description1")}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("careers.description2")}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("careers.description3")}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("careers.description4")}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("careers.description5")}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t("careers.thankYou")}
          </p>
        </div>
      </div>
    </div>
  );
}
