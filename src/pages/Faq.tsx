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
      <div className="space-y-4">
        {faqData.map((item, idx) => (
          <div //add a class to this div to makes its span change color when the div is hovered
          
            key={item.question}
            className="overflow-hidden transition-shadow duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
          >
            <button
              className="flex items-center justify-between w-full p-6 text-left transition-colors duration-200 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-indigo-300"
              onClick={() => toggleAccordion(idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 ">
                {item.question}
              </span>
              <span className="ml-4 text-2xl text-gray-400 hover:text-indigo-600">
                {openIndex === idx ? "-" : "+"}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
