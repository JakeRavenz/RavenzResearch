import React from 'react';

const Footer = () => {
  const navigation = {
    jobSeekers: [
      { name: 'Browse remote jobs', href: '/jobs' },
    ],
    companies: [
      { name: 'Post a remote job', href: '/post-job' },
      { name: 'Create a company bio', href: '/company-bio' },
    ]
    // Removed remoteWork property
  };
  
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          
          {/* Removed Remote work section */}
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-600 text-sm">
            Copyright © {new Date().getFullYear()}. Remote Technology, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;