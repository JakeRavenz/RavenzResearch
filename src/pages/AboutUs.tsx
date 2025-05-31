import React from "react";
// import WhatsAppWidget from "../components/WhatsAppWidget";

export default function AboutUs() {
  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        About Us
      </h1>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Welcome to Ravenz Research, your go-to platform for discovering the
            best remote job opportunities. We understand the evolving landscape
            of work and the growing desire for flexibility and work-life
            balance. Our mission is to connect talented individuals with
            companies that embrace remote work.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Ravenz Research is a leading platform connecting talented
            individuals with top-tier remote work opportunities. We specialize
            in AI training, data annotation, and online research projects,
            helping businesses enhance their machine learning models.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            At Ravenz Research, we believe that talent knows no boundaries.
            That's why we've created a space where job seekers can explore a
            wide range of remote positions across various industries. Whether
            you're a seasoned professional or just starting your career, we're
            here to help you find the perfect remote job that aligns with your
            skills and aspirations.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Our platform is designed to be user-friendly and efficient, making
            your job search as smooth as possible. We provide detailed job
            descriptions, company information, and salary ranges to ensure you
            have all the information you need to make informed decisions.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We are committed to fostering a community of remote workers and
            companies. We regularly update our job listings and resources to
            keep you informed about the latest trends in remote work.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Thank you for choosing Ravenz Research. We're excited to be a part
            of your remote work journey!
          </p>
        </div>
      </div>
    </div>
  );
}
