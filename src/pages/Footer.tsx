import React from 'react';

const Footer = () => {
  const navigation = {
    company: [
      { name: 'About Ravennz Research', href: '/aboutUs' },
      { name: 'Careers', href: '/careers' },
      { name: 'Support', href: '/contact' },
      { name: 'Contact us', href: '/contact' },
    ],
    jobSeekers: [
      { name: 'Sign up with Ravenz Research', href: '/signup' },
      { name: 'Browse remote jobs', href: '/jobs' },
    ],
    companies: [
      { name: 'Post a remote job', href: '/post-job' },
      { name: 'Create a company bio', href: '/company-bio' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ],
    social: [
      {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: (props) => (
          <svg {...props}>
            {/* Facebook SVG content */}
          </svg>
        ),
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: (props) => (
          <svg {...props}>
            {/* Twitter SVG content */}
          </svg>
        ),
      },
      // Add other social links as needed
    ],
  };

  return (
    <footer className="bg-white">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Section */}
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

          {/* Job Seekers Section */}
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

          {/* Companies Section */}
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

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-4">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="pt-8 mt-12 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Copyright © {new Date().getFullYear()}. Remote Technology, Inc. All rights reserved.
          </p>

          <div className="flex items-center justify-between mt-8">
            {/* Legal Links */}
            <div className="flex space-x-6">
              {navigation.legal.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="w-6 h-6" />
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
