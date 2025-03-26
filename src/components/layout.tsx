
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import Navigation from './Navbar';
import Footer from '../pages/Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Define routes where you want to hide the Navbar and Footer.
  const hideLayout = location.pathname.match(/^\/jobs\/[^/]+$/) !== null;
  
  // Define routes that need full width (no container constraints)
  // This gives more flexibility than just hiding the layout
  const useFullWidth = 
    location.pathname.match(/^\/jobs\/[^/]+$/) !== null || 
    location.pathname === '/jobs' ||
    location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideLayout && <Navigation />}
      
      <main className={`flex-grow ${useFullWidth ? '' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children ? children : <Outlet />}
      </main>
      
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;