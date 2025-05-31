import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import logo from "../assets/Ravenz Research logo alone.png?url";
import { useTheme } from "../contexts/ThemeContext";
import useAuth from "../hooks/useAuth"; // Ensure this path is correct
import { Sun, Moon, LogIn, UserPlus, UserCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

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

  const getLinkClasses = (path: string, isAuthButton = false) => {
    const isActive = currentPath === path;
    if (isAuthButton) {
      return isActive
        ? "bg-indigo-700 text-white px-6 py-2 font-['Inter'] rounded-lg shadow-md"
        : "bg-indigo-600 text-white px-6 py-2 hover:bg-indigo-700 font-['Inter'] rounded-lg";
    }
    return isActive
      ? "text-indigo-800 dark:text-indigo-200 font-semibold bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-lg px-4 py-2 transition-colors ring-2 ring-indigo-300/30 dark:ring-indigo-700/40"
      : "text-gray-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg px-4 py-2 font-medium transition-colors";
  };
  return (
    <>
      <nav className="bg-white border-b border-gray-200 h-[4.3rem] w-full dark:border-gray-700 dark:bg-gray-900 shadow-md sticky top-0 left-0 z-50">
        <div className="flex items-center justify-between h-full">
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
            />
            <span
              className={`font-bold text-xl font-['Inter'] ${
                currentPath === "/"
                  ? "text-indigo-600 dark:text-indigo-500"
                  : "text-gray-700 dark:text-slate-400"
              }`}
            >
              Ravenz Research
            </span>
          </Link>
          {/* Nav Links */}
          <div className="items-center hidden pr-6 ml-auto space-x-12 md:flex ">
            {/* Responsive horizontal scroll for nav links on small screens */}
            <div className="flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent max-w-[80vw] md:max-w-none">
              {user ? (
                <Link
                  to="/jobs"
                  className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                    "/jobs"
                  )}`}
                >
                  <BriefcaseIcon className="w-5 h-5" />
                  <span>Jobs</span>
                </Link>
              ) : null}
              <Link
                to="/aboutUs"
                className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                  "/aboutUs"
                )}`}
              >
                <InformationCircleIcon className="w-5 h-5" />
                <span>About Us</span>
              </Link>
              <Link
                to="/faq"
                className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                  "/faq"
                )}`}
              >
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span>FAQ</span>
              </Link>
              <Link
                to="/contact"
                className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                  "/contact"
                )}`}
              >
                <EnvelopeIcon className="w-5 h-5" />
                <span>Contact Us</span>
              </Link>
              {user ? (
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                    "/profile"
                  )}`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link to="/auth" className={`${getLinkClasses("/auth", true)}`}>
                  sign in
                </Link>
              )}
              {user ? (
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                    "/dashboard"
                  )}`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              ) : null}
            </div>
            {/* Theme toggle remains outside for accessibility */}
            <button
              onClick={toggleTheme}
              className="p-2 ml-2 text-gray-600 rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}

          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none lg:hidden"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              className="pr-6 ml-auto text-gray-700 dark:hover:text-gray-500 md:hidden"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
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
                className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                  "/jobs"
                )}`}
                onClick={closeSidebar}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span>Jobs</span>
              </Link>
            ) : null}

            <Link
              to="/aboutUs"
              className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                "/aboutUs"
              )}`}
              onClick={closeSidebar}
            >
              <InformationCircleIcon className="w-5 h-5" />
              <span>About Us</span>
            </Link>

            <Link
              to="/faq"
              className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                "/faq"
              )}`}
              onClick={closeSidebar}
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span>FAQ</span>
            </Link>

            <Link
              to="/contact"
              className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                "/contact"
              )}`}
              onClick={closeSidebar}
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>

            {user ? (
              <Link
                to="/profile"
                className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                  "/profile"
                )}`}
                onClick={closeSidebar}
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className={`${getLinkClasses("/auth", true)} text-center`}
                onClick={closeSidebar}
              >
                Sign In
              </Link>
            )}
            {user ? (
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 font-['Inter'] ${getLinkClasses(
                  "/dashboard"
                )}`}
                onClick={closeSidebar}
              >
                <UserIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
