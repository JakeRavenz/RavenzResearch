import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Briefcase, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  // Password validation effect
  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password)
    });
  }, [password]);

  // Check if all password validations are met
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Additional validation before submission
    if (isSignUp) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      if (!isPasswordValid) {
        toast.error("Please meet all password requirements");
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
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

  // Validation component for password requirements
  const PasswordValidationItem = ({ 
    isValid, 
    text 
  }: { 
    isValid: boolean, 
    text: string 
  }) => (
    <div className={`flex items-center space-x-2 ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
      {isValid ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      <span className="text-xs">{text}</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-8">
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
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out pr-10"
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
            <>
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Password must contain:
                </p>
                <div className="space-y-1">
                  <PasswordValidationItem 
                    isValid={passwordValidation.length} 
                    text="At least 8 characters" 
                  />
                  <PasswordValidationItem 
                    isValid={passwordValidation.uppercase} 
                    text="One uppercase letter" 
                  />
                  <PasswordValidationItem 
                    isValid={passwordValidation.lowercase} 
                    text="One lowercase letter" 
                  />
                  <PasswordValidationItem 
                    isValid={passwordValidation.number} 
                    text="One number" 
                  />
                  <PasswordValidationItem 
                    isValid={passwordValidation.specialChar} 
                    text="One special character (!@#$%^&*)" 
                  />
                </div>
              </div>
            </>
          )}
          
          <button
            type="submit"
            disabled={
              loading || 
              (isSignUp && (!isPasswordValid || password !== confirmPassword))
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