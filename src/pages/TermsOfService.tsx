import React from "react";
import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 mb-6 border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t("terms_of_service")}
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("terms_of_service_intro")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("acceptance_of_terms")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("acceptance_of_terms_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("use_of_services")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("use_of_services_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("user_accounts")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("user_accounts_desc")}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("user_accounts_desc2")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("payments_refunds")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("payments_refunds_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("id_verification_process")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("id_verification_process_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("prohibited_activities")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("prohibited_activities_desc")}
          </p>
          <ul className="mb-4 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>{t("prohibited_activity_1")}</li>
            <li>{t("prohibited_activity_2")}</li>
            <li>{t("prohibited_activity_3")}</li>
          </ul>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            {t("disclaimer_limitation_of_liability")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("disclaimer_limitation_of_liability_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("termination_of_services")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("termination_of_services_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("changes_to_terms")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("changes_to_terms_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("indemnification")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("indemnification_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("intellectual_property")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("intellectual_property_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("governing_law")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("governing_law_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("contact_us")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("contact_us_desc")}
            <a
              href="mailto:support@ravenzresearch.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              support@ravenzresearch.com
            </a>
            .
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {t("terms_of_service_thank_you")}
          </p>
        </div>
      </div>
    </div>
  );
}
