import React from "react";

export default function Careers() {
  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Careers
      </h1>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            At Ravenz Research, we're always looking for talented individuals to
            join our team. If you're passionate about remote work and want to be
            part of a dynamic and growing company, we'd love to hear from you!
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We offer a variety of remote positions across different departments,
            including AI training, data annotation, online research, and more.
            Whether you're a seasoned professional or just starting your career,
            we have opportunities for you.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Our team is made up of diverse individuals who are passionate about
            their work and committed to our mission. We foster a collaborative
            and inclusive environment where everyone's ideas are valued.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We offer competitive pay rates, career growth opportunities, and a
            supportive work environment. We believe in investing in our
            employees and providing them with the resources they need to
            succeed.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            If you're interested in joining our team, please check out our open
            positions on the jobs page. We're excited to learn more about you
            and how you can contribute to Ravenz Research.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Thank you for your interest in Ravenz Research. We look forward to
            hearing from you!
          </p>
        </div>
      </div>
    </div>
  );
}
