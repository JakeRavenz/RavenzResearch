import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Globe, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
    <div className="p-3 bg-indigo-50 inline-flex items-center justify-center">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
    <div className="mt-4 text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
      Learn more
      <ArrowRight className="ml-1 h-4 w-4" />
    </div>
  </div>
);

const ActionButton: React.FC<{
  to: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}> = ({ to, variant, children }) => (
  <Link
    to={to}
    className={`${
      variant === 'primary'
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
        : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
    } px-6 py-3 font-medium transition-colors flex items-center gap-2`}
  >
    {children}
    {variant === 'primary' && <ArrowRight className="h-4 w-4" />}
  </Link>
);

export default function Home() {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
      title: 'Remote Jobs',
      description: 'Find flexible remote positions from companies worldwide',
    },
    {
      icon: <Building2 className="h-8 w-8 text-indigo-600" />,
      title: 'Top Companies',
      description: 'Connect with leading companies embracing remote work',
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      title: 'Work Anywhere',
      description: 'Choose your workplace and maintain work-life balance',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section - Sharp edges */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 my-8">
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-20"></div>
        
        <div className="relative z-10 text-center py-16 md:py-24 px-4 md:px-6">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl leading-tight">
            Find Your Perfect Remote Job
          </h1>
          <p className="mt-6 text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Connect with top companies hiring remote talent worldwide
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
      <div className="bg-white shadow-sm mb-16 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-indigo-600">1,200+</div>
            <div className="text-gray-600">Remote Jobs</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-indigo-600">500+</div>
            <div className="text-gray-600">Companies</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-indigo-600">50k+</div>
            <div className="text-gray-600">Job Seekers</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-indigo-600">40+</div>
            <div className="text-gray-600">Countries</div>
          </div>
        </div>
      </div>
      
      {/* Features Section - Sharp edges */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We connect talented professionals with the best remote opportunities worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
      
      {/* CTA Section - Sharp edges */}
      <div className="bg-gray-50 p-8 mb-16">
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ready to start your remote journey?</h2>
            <p className="mt-2 text-lg text-gray-600">
              Join thousands of professionals who found their dream remote jobs.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <ActionButton to="/signup" variant="primary">
              Get Started
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}