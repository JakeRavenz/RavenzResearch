import React from "react";

export default function Contact() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Contact Us</h1>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <p className="mb-4 text-gray-700">
          We'd love to hear from you! Whether you have a question about our
          services, need assistance with your account, or just want to share
          your feedback, please don't hesitate to reach out.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              General Inquiries
            </h2>
            <p className="mb-2 text-gray-700">
              For general questions or information about Ravenz Research, please
              email us at:
            </p>
            <a
              href="mailto:info@ravenzresearch.com"
              className="text-blue-600 hover:text-blue-800"
            >
              info@ravenzresearch.com
            </a>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Support
            </h2>
            <p className="mb-2 text-gray-700">
              If you need help with your account or have any technical issues,
              please contact our support team at:
            </p>
            <a
              href="mailto:support@ravenzresearch.com"
              className="text-blue-600 hover:text-blue-800"
            >
              support@ravenzresearch.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
