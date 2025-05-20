import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import logo from "../assets/Ravenz Research logo alone.png";
import { useTheme } from "../contexts/ThemeContext";
import useAuth from "../hooks/useAuth"; // Ensure this path is correct
import { Sun, Moon, LogIn, UserPlus, UserCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 h-[80px] w-full dark:border-gray-700 dark:bg-gray-900 shadow-md">
        <div className="flex items-center h-full">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center pl-6 space-x-2"
            onClick={closeSidebar}
          >
            <img
              // src="/src/assets/Ravenz Research logo alone.png"
              src={logo}
              alt="Logo"
              className="w-8 h-8"
            />{" "}
            <span className="font-bold text-xl text-gray-700 dark:text-slate-400 font-['Inter']">
              Ravenz Research
            </span>
          </Link>
          {/* Nav Links */}
          <div className="items-center hidden pr-6 ml-auto space-x-12 md:flex ">
            {user ? (
              <Link
                to="/jobs"
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-600 font-['Inter']"
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span>Jobs</span>
              </Link>
            ) : null}
            {user ? (
              <Link
                to="/myJobs"
                className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span>My Jobs</span>
              </Link>
            ) : null}
            <Link
              to="/aboutUs"
              className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
            >
              <InformationCircleIcon className="w-5 h-5" />
              <span>About Us</span>
            </Link>
            <Link
              to="/faq"
              className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span>FAQ</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>{" "}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-6 py-2 hover:bg-indigo-900 font-['Inter']"
              >
                sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="pr-6 ml-auto text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="w-6 h-6" />
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
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={closeSidebar}
              className="text-gray-700 dark:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col mt-8 space-y-6">
            {user ? (
              <Link
                to="/jobs"
                className="flex items-center space-x-2 text-gray-700  dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
                onClick={closeSidebar}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span>Jobs</span>
              </Link>
            ) : null}

            {user ? (
              <Link
                to="/myJobs"
                className="flex items-center space-x-2 text-gray-700  dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
                onClick={closeSidebar}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span>My Jobs</span>
              </Link>
            ) : null}

            <Link
              to="/aboutUs"
              className="flex items-center space-x-2 text-gray-700  dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
              onClick={closeSidebar}
            >
              <InformationCircleIcon className="w-5 h-5" />
              <span>About Us</span>
            </Link>

            <Link
              to="/faq"
              className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
              onClick={closeSidebar}
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span>FAQ</span>
            </Link>

            <Link
              to="/contact"
              className="flex items-center space-x-2 text-gray-700  dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
              onClick={closeSidebar}
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 dark:text-slate-400 dark:hover:text-indigo-600 hover:text-indigo-600 font-['Inter']"
                onClick={closeSidebar}
              >
                <UserIcon className="w-5 h-5" />
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
