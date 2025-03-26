import React from "react";

export default function Faq() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            What is Ravenz Research?
          </h2>
          <p className="text-gray-700">
            Ravenz Research is a platform that connects job seekers with remote
            job opportunities. We specialize in AI training, data annotation,
            and online research projects.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            How do I find a job on Ravenz Research?
          </h2>
          <p className="text-gray-700">
            You can browse our job listings by visiting the "Jobs" page. You can
            filter jobs by type, location, and more.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Is Ravenz Research free to use?
          </h2>
          <p className="text-gray-700">
            Yes, Ravenz Research is free for job seekers. You can browse jobs,
            create a profile, and apply for positions at no cost.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            How do I apply for a job?
          </h2>
          <p className="text-gray-700">
            Once you find a job you're interested in, click on the job listing
            to view more details. You can then apply directly through our
            platform.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            How is payment done?
          </h2>
          <p className="text-gray-700">
            We ensure timely and secure payments to all our contributors.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            What are the payment methods?
          </h2>
          <p className="text-gray-700">
            <ol className="list-decimal list-inside">
              <li>PayPal</li>
              <li>Payoneer</li>
              <li>Direct Bank Transfer (for eligible countries)</li>
            </ol>
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            How often are payments processed?
          </h2>
          <p className="text-gray-700">
            Payments are processed bi-weekly, and users can track their earnings
            through their dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
