import React, { useContext } from 'react';
import useAuth from '../hooks/useAuth'; 

const Footer = () => {

  const { user } = useAuth(); 
  
  const isRavenzEmployee = user && user.email && user.email.endsWith('@ravenzresearch.com');
  const isLoggedIn = !!user;

  const navigation = {
    company: [
      { name: 'About Ravenz Research', href: '/aboutUs' },
      { name: 'Careers', href: '/careers' },
      { name: 'Support', href: '/contact' },
      { name: 'Contact us', href: '/contact' },
    ],
    jobSeekers: [
      { name: 'Browse remote jobs', href: '/jobs' },
    ],
    nonLoggedInUsers: [
      { name: 'Sign up with Ravenz Research', href: '/signup' },
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
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        ),
      },
    ],
  };

  // Determine grid columns based on visible sections
  let gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  
  // If Ravenz employee, show all 4 sections
  if (isRavenzEmployee) {
    gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  }

  return (
    <footer className="bg-white">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${gridClass}`}>
          {/* Company Section - Always visible */}
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
              {/* Show sign up link only to non-logged in users */}
              {!isLoggedIn && navigation.nonLoggedInUsers.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
              {/* Show job browsing option to everyone */}
              {navigation.jobSeekers.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Companies Section - Only visible to Ravenz employees */}
          {isRavenzEmployee && (
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
          )}

          {/* Legal Section - Always visible */}
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8">
            {/* Legal Links */}
            <div className="flex flex-wrap space-x-6 mb-4 md:mb-0">
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
                  target="_blank"
                  rel="noopener noreferrer"
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