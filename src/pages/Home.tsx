import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Globe } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    {icon}
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
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
        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
        : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
    } px-6 py-3 rounded-md`}
  >
    {children}
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
    <div className="max-w-7xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Find Your Perfect Remote Job
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Connect with top companies hiring remote talent worldwide
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <ActionButton to="/jobs" variant="primary">
            Browse Jobs
          </ActionButton>
          <ActionButton to="/companies" variant="secondary">
            View Companies
          </ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}