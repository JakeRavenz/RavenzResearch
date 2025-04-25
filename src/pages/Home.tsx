import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, Globe, ArrowRight } from "lucide-react";
import heroImage from "../assets/images.png";
import reasonImage from "../assets/3718985.jpg";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-6 transition-all bg-white border border-gray-100 shadow-sm md:p-8 hover:shadow-md group">
    <div className="inline-flex items-center justify-center p-3 bg-indigo-50">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

const ActionButton: React.FC<{
  to: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}> = ({ to, variant, children }) => (
  <Link
    to={to}
    className={`${
      variant === "primary"
        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
        : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
    } px-6 py-3 font-medium transition-colors flex items-center gap-2`}
  >
    {children}
    {variant === "primary" && <ArrowRight className="w-4 h-4" />}
  </Link>
);

export default function Home() {
  const features = [
    {
      icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
      title: "Remote Jobs",
      description: "Find flexible remote positions from companies worldwide",
    },
    {
      icon: <Building2 className="w-8 h-8 text-indigo-600" />,
      title: "Top Companies",
      description: "Connect with leading companies embracing remote work",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Work Anywhere",
      description: "Choose your workplace and maintain work-life balance",
    },
  ];

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Hero Section - Sharp edges */}
      <div className="relative flex flex-col my-8 overflow-hidden md:flex-row-reverse bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="p-6">
          <img
            src={heroImage}
            alt="hero image"
            className="object-cover w-full h-full rounded-lg shadow-lg "
          />
        </div>

        <div className="relative z-10 pt-8 pb-16 text-center md:py-24 md:px-6 ">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Find Your Perfect Remote Job
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-indigo-100 md:text-xl">
            Connect with top companies hiring remote talent worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <ActionButton to="/jobs" variant="primary">
              Browse Jobs
            </ActionButton>
            <ActionButton to="/companies" variant="secondary">
              View Companies
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Stats Section - Sharp edges */}
      <div className="py-4 mb-16 bg-white shadow-sm">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">1,200+</div>
            <div className="text-gray-600">Remote Jobs</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">500+</div>
            <div className="text-gray-600">Companies</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">50k+</div>
            <div className="text-gray-600">Job Seekers</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">40+</div>
            <div className="text-gray-600">Countries</div>
          </div>
        </div>
      </div>

      {/* Features Section - Sharp edges */}
      <div className="mb-16"><div className="p-6">
          <img
            src={reasonImage}
            alt="hero image"
            className="object-cover w-full h-full rounded-lg "
          />
        </div>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            We connect talented professionals with the best remote opportunities
            worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* CTA Section - Sharp edges */}
      <div className="grid items-center p-8 m b-16 bg-gray-50">
        <div className="md:flex md:items-center md:justify-between">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to start your remote journey?
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Join thousands of professionals who found their dream remote jobs.
            </p>
          </div>
          <div className="mt-4 md:mt-0"></div>
        </div>
      </div>
    </div>
  );
}
