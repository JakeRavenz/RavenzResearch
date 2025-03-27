import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName
              }
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (isSignUp) {
        toast.success("Account created successfully! Please sign in.");
        setIsSignUp(false);
      } else {
        toast.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName = "block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="mb-8 text-center">
        <Briefcase className="w-12 h-12 mx-auto text-indigo-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isSignUp
            ? "Start your journey to find the perfect remote job"
            : "Sign in to access your account"}
        </p>
      </div>

      <div className="p-8 bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className={labelClassName}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClassName}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className={labelClassName}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClassName}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className={labelClassName}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className={labelClassName}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
                title="Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character (!@#$%^&*)."
                className={`${inputClassName} pr-10`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className={labelClassName}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== password) {
                    e.target.setCustomValidity("Passwords do not match");
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
                className={inputClassName}
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={
              loading ||
              !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
                password
              ) ||
              (isSignUp && password !== confirmPassword)
            }
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                {isSignUp ? "Creating account..." : "Signing in..."}
              </span>
            ) : (
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}