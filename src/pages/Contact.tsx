import { EnvelopeIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function Contact() {
  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Contact Us
      </h1>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We'd love to hear from you! Whether you have a question about our
            services, need assistance with your account, or just want to share
            your feedback, please don't hesitate to reach out.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative p-6 border shadow-md rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/30 dark:border-slate-800/40">
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                General Inquiries
              </h2>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                For general questions or information about Ravenz Research,
                please email us at:
              </p>{" "}
              <a
                href="mailto:info@ravenzresearch.com"
                className="flex gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <span>info@ravenzresearch.com</span>
              </a>
            </div>
            <div className="relative p-6 border shadow-md rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/30 dark:border-slate-800/40">
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Support
              </h2>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                If you need help with your account or have any technical issues,
                please contact our support team at:
              </p>
              <a
                href="mailto:support@ravenzresearch.com"
                className="flex gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <span>support@ravenzresearch.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
