// src/components/Layout.tsx
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
  // For example, if you want to hide them on /jobs/:id (JobDetails) page,
  // you can check if the pathname matches that pattern.
  // Here, we assume that if the pathname starts with '/jobs/' and is not '/jobs/apply',
  // we hide the layout. Adjust this logic as needed.
  const hideLayout = location.pathname.match(/^\/jobs\/[^/]+$/) !== null;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navigation />}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children ? children : <Outlet />}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
