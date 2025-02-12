import React from 'react';
import { Youtube, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const navigation = {
    company: [
      { name: 'About Remote', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Support', href: '/support' },
      { name: 'Contact us', href: '/contact' },
    ],
    jobSeekers: [
      { name: 'Sign up with Remote Jobs', href: '/signup' },
      { name: 'Browse remote jobs', href: '/jobs' },
    ],
    companies: [
      { name: 'Post a remote job', href: '/post-job' },
      { name: 'Create a company bio', href: '/company-bio' },
      { name: 'Pricing', href: '/pricing' },
    ],
    remoteWork: [
      { name: 'Remote jobs by category', href: '/categories' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Terms of Use', href: '/terms' },
    ],
    social: [
      { name: 'YouTube', icon: Youtube, href: '#' },
      { name: 'LinkedIn', icon: Linkedin, href: '#' },
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'Instagram', icon: Instagram, href: '#' },
    ],
  };

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">For job seekers</h3>
            <ul className="mt-4 space-y-4">
              {navigation.jobSeekers.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">For companies</h3>
            <ul className="mt-4 space-y-4">
              {navigation.companies.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Remote work</h3>
            <ul className="mt-4 space-y-4">
              {navigation.remoteWork.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-600 text-sm">
            Copyright © {new Date().getFullYear()}. Remote Technology, Inc. All rights reserved.
          </p>
          
          <div className="mt-8 flex justify-between items-center">
            <div className="flex space-x-6">
              {navigation.legal.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;