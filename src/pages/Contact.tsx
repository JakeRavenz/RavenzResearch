import { EnvelopeIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function Contact() {
  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We'd love to hear from you! Whether you have a question about our
          services, need assistance with your account, or just want to share
          your feedback, please don't hesitate to reach out.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
              General Inquiries
            </h2>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              For general questions or information about Ravenz Research, please
              email us at:
            </p>{" "}
            <a
              href="mailto:info@ravenzresearch.com"
              className="flex gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <EnvelopeIcon className="w-5 h-5 mb-2" /><span>info@ravenzresearch.com</span>
            </a>
          </div>
          <div>
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
               <EnvelopeIcon className="w-5 h-5 " /><span>support@ravenzresearch.com</span>
            </a> 
          </div>
        </div>
      </div>
    </div>
  );
}
