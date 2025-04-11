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
      { name: 'Privacy Policy', href: '/policies' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ],
    social: [
      {
        name: 'Facebook',
        href: '/https://www.facebook.com/share/1AFwvAPT9m',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        name: 'Instagram',
        href: '/https://www.instagram.com/ravenz_research?igsh=dnhuNWMyeHdkMWFw',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
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

          <div className="flex flex-col mt-8 md:flex-row md:items-center md:justify-between">
            {/* Legal Links */}
            <div className="flex flex-wrap mb-4 space-x-6 md:mb-0">
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

            {/* Social Links - Facebook and Instagram only */}
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