import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 h-[80px] w-full">
        <div className="h-full flex items-center">
          {/* Logo Section - Extreme Left */}
          <Link to="/" className="flex items-center space-x-2 pl-6" onClick={closeSidebar}>
            <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-[bg-emerald-400] font-['Inter']">
              RemoteWork
            </span>
          </Link>

          {/* Right Section with Nav Links and Sign In */}
          <div className="hidden md:flex items-center ml-auto pr-6 space-x-12">
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-['Inter']"
            >
              <BriefcaseIcon className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              to="/companies"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-['Inter']"
            >
              <BuildingOffice2Icon className="h-5 w-5" />
              <span>Companies</span>
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-['Inter']"
              >
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-emerald-400 text-white px-6 py-2 hover:bg-emerald-400 font-['Inter']"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden text-gray-700 pr-6 ml-auto"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-end">
            <button onClick={closeSidebar} className="text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 flex flex-col space-y-6">
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-['Inter']"
              onClick={closeSidebar}
            >
              <BriefcaseIcon className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              to="/companies"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-['Inter']"
              onClick={closeSidebar}
            >
              <BuildingOffice2Icon className="h-5 w-5" />
              <span>Companies</span>
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-['Inter']"
                onClick={closeSidebar}
              >
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-6 py-2 hover:bg-indigo-700 font-['Inter'] text-center"
                onClick={closeSidebar}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}