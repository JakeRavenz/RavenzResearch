import React from "react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <div className="relative z-10 max-w-4xl px-4 py-8 mx-auto">
        <div className="p-6 mb-6 border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t("privacy_policy")}
          </h1>

          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("privacy_policy_intro")}
          </p>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("information_we_collect")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("information_we_collect_intro")}
          </p>
          <ul className="mb-4 text-gray-700 list-disc list-inside dark:text-gray-300">
            <li>
              <strong>{t("personal_information")}:</strong>{" "}
              {t("personal_information_desc")}
            </li>
            <li>
              <strong>{t("usage_data")}:</strong> {t("usage_data_desc")}
            </li>
            <li>
              <strong>{t("cookies")}:</strong> {t("cookies_desc")}
            </li>
          </ul>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("how_we_use_your_information")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("how_we_use_your_information_desc")}
          </p>
          <ul className="mb-4 text-gray-700 list-disc list-inside dark:text-gray-300">
            <li>{t("use_case_1")}</li>
            <li>{t("use_case_2")}</li>
            <li>{t("use_case_3")}</li>
            <li>{t("use_case_4")}</li>
            <li>{t("use_case_5")}</li>
            <li>{t("use_case_6")}</li>
          </ul>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("data_security")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("data_security_desc")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("your_rights")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("your_rights_desc")}
          </p>
          <ul className="mb-4 text-gray-700 list-disc list-inside dark:text-gray-300">
            <li>{t("right_1")}</li>
            <li>{t("right_2")}</li>
            <li>{t("right_3")}</li>

            <li>{t("right_4")}</li>
          </ul>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("changes_to_privacy_policy")}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t("changes_to_privacy_policy_desc")}
          </p>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {t("contact_us")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t("contact_us_desc")}
            <a
              href="mailto:info@ravenzresearch.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              info@ravenzresearch.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
