import React, { useState } from "react";

const faqData = [
  {
    question: "What is Ravenz Research?",
    answer: (
      <>
        Ravenz Research is a platform that connects job seekers with remote job
        opportunities. We specialize in AI training, data annotation, and online
        research projects.
      </>
    ),
  },
  {
    question: "How do I find a job on Ravenz Research?",
    answer: (
      <>
        You can browse our job listings by visiting the "Jobs" page. You can
        filter jobs by type, location, and more.
      </>
    ),
  },
  {
    question: "Is Ravenz Research free to use?",
    answer: (
      <>
        Yes, Ravenz Research is free for job seekers. You can browse jobs,
        create a profile, and apply for positions at no cost.
      </>
    ),
  },
  {
    question: "How do I apply for a job?",
    answer: (
      <>
        Once you find a job you're interested in, click on the job listing to
        view more details. You can then apply directly through our platform.
      </>
    ),
  },
  {
    question: "How is payment done?",
    answer: <>We ensure timely and secure payments to all our contributors.</>,
  },
  {
    question: "What are the payment methods?",
    answer: (
      <ol className="list-decimal list-inside">
        <li>PayPal</li>
        <li>Payoneer</li>
        <li>Direct Bank Transfer (for eligible countries)</li>
      </ol>
    ),
  },
  {
    question: "How often are payments processed?",
    answer: (
      <>
        Payments are processed bi-weekly, and users can track their earnings
        through their dashboard.
      </>
    ),
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h1>
      <p className="mb-8 max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 text-center">
        Find answers to the most common questions about using Ravenz Research,
        our platform features, job application process, and more. If you have a
        question that isn't covered here, feel free to contact our support team.
      </p>
      <div className="space-y-6">
        {faqData.map((item, idx) => (
          <div
            key={item.question}
            className={`relative overflow-hidden transition-all duration-300 p-0 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg backdrop-blur-md bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 group hover:scale-[1.02] hover:shadow-2xl`}
          >
            <button
              className="flex items-center justify-between w-full p-6 text-left transition-colors duration-200 focus:outline-none bg-transparent hover:bg-indigo-50/40 dark:hover:bg-indigo-900/30 rounded-2xl"
              onClick={() => toggleAccordion(idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                {item.question}
              </span>
              <span
                className={`ml-4 text-2xl transition-colors ${
                  openIndex === idx
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"
                }`}
              >
                {openIndex === idx ? "-" : "+"}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 animate-fade-in">
                {item.answer}
              </div>
            )}
            {/* Decorative blurred gradient blob */}
            <span className="absolute z-0 w-24 h-24 rounded-full -top-6 -right-6 bg-gradient-to-tr from-indigo-300 via-blue-200 to-purple-200 dark:from-indigo-400/10 dark:via-indigo-700/10 dark:to-blue-900/10 blur-2xl pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
