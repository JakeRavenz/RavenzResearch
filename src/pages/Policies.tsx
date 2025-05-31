import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="relative w-full p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 mb-6 border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>

          <p className="mb-4 text-gray-700 dark:text-gray-300">
            At Ravenz Research, we are committed to protecting your privacy.
            This Privacy Policy outlines how we collect, use, and safeguard your
            personal information when you use our website and services.
          </p>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Information We Collect
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We may collect the following types of information:
          </p>
          <ul className="mb-4 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>
              <strong>Personal Information:</strong> When you create an account,
              apply for a job, or contact us, we may collect personal
              information such as your name, email address, phone number,
              address, Government issued ID, payment details, and resume.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you
              use our website, including your IP address, browser type, pages
              visited, and time spent on our site.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to enhance your
              experience on our website. Cookies are small files stored on your
              device that help us remember your preferences and track usage
              patterns.
            </li>
          </ul>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            How We Use Your Information
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We use your information for the following purposes:
          </p>
          <ul className="mb-4 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>
              Verify your identity and access to your account, and to schedule
              verification appointments.
            </li>
            <li>To provide and improve our services.</li>
            <li>
              To process job applications and connect job seekers with
              employers.
            </li>
            <li>
              To communicate with you about your account, job applications, and
              updates to our services.
            </li>
            <li>To personalize your experience on our website.</li>
            <li>
              To analyze usage patterns and improve our website's functionality.
            </li>
          </ul>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Data Security
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We take data security seriously and implement appropriate technical
            and organizational measures to protect your personal information
            from unauthorized access, loss, or misuse. However, no method of
            transmission over the internet or electronic storage is 100% secure,
            and we cannot guarantee its absolute security.
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Rights
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            You reserve the rights to:
          </p>
          <ul className="mb-4 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>Access your personal information.</li>
            <li>Correct any inaccuracies in your personal information.</li>
            <li>Request deletion of your personal information.</li>

            <li>Data portability.</li>
          </ul>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Changes to This Privacy Policy
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes.
          </p>

          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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
