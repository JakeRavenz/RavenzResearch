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
      let signUpResult;
      if (isSignUp) {
        signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        const { error: signUpError, data } = signUpResult;
        if (signUpError) throw signUpError;
        // Insert email into profile table
        if (data && data.user && data.user.email) {
          await supabase
            .from("profile")
            .upsert([{ id: data.user.id, email: data.user.email }], {
              onConflict: "id",
            });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // On sign in, upsert email into profile table as well
        if (data && data.user && data.user.email) {
          await supabase
            .from("profile")
            .upsert([{ id: data.user.id, email: data.user.email }], {
              onConflict: "id",
            });
        }
      }

      if (isSignUp) {
        toast.success("Account created successfully! Please sign in.");
        setIsSignUp(false);
      } else {
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out";
  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1";

  // --- USER REVIEWS CAROUSEL ---
  const userReviews = [
    {
      name: "Aisha O.",
      role: "Remote Data Annotator",
      review:
        "Ravenz made it so easy to find remote work. The application process was smooth and the support team is fantastic!",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "James K.",
      role: "Content Moderator",
      review:
        "I landed my first remote job thanks to Ravenz. The dashboard and job tracking features are top-notch!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya S.",
      role: "Customer Support Agent",
      review:
        "The community and resources helped me prepare for interviews and succeed in my new role.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  function UserReviewCarousel() {
    const [index, setIndex] = React.useState(0);
    const [fade, setFade] = React.useState(true);
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % userReviews.length);
          setFade(true);
        }, 400);
      }, 3500);
      return () => clearTimeout(timeout);
    }, [index]);
    const review = userReviews[index];
    return (
      <div className="relative flex items-center justify-center w-full h-64 max-w-md mx-auto sm:h-72 md:h-80 lg:h-96 xl:max-w-lg">
        <div
          className={`absolute inset-0 transition-opacity duration-400 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 backdrop-blur-xl flex flex-col items-center justify-center px-6 py-8 md:px-10 md:py-10 text-center overflow-hidden bg-white/90 dark:bg-slate-900/90 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          key={index}
        >
          {/* Avatar at the top */}
          <img
            src={review.avatar}
            alt={review.name}
            className="object-cover w-20 h-20 mb-4 border-4 border-indigo-400 rounded-full shadow-xl"
          />
          <div className="mb-2 text-xl font-semibold text-indigo-700 sm:text-2xl md:text-3xl dark:text-indigo-300 drop-shadow">
            {review.name}
          </div>
          <div className="mb-2 text-sm font-medium text-gray-500 sm:text-base md:text-lg dark:text-gray-400 drop-shadow">
            {review.role}
          </div>
          <div className="max-w-xl text-base italic text-gray-700 sm:text-lg md:text-xl dark:text-gray-200 drop-shadow">
            “{review.review}”
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-screen bg-slate-300 dark:bg-slate-900">
      <div className="container max-w-4xl px-2 mx-auto">
        <div className="relative p-2 md:p-4 lg:p-6 mb-8 overflow-hidden shadow-2xl rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center min-h-[60vh]">
          <span className="absolute rounded-full pointer-events-none -top-16 -left-16 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
          <span className="absolute rounded-full pointer-events-none -bottom-16 -right-16 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
          <div className="relative z-10 flex flex-col-reverse items-stretch justify-center w-full gap-6 lg:flex-row md:gap-8">
            {/* Auth Form Card */}
            <div className="flex flex-col justify-center flex-1 min-w-[220px] max-w-sm bg-white/80 dark:bg-slate-800/80 rounded-lg border border-white/40 dark:border-slate-700 shadow-lg backdrop-blur-xl p-4 md:p-6">
              <div className="mb-8 text-center">
                <Briefcase className="w-12 h-12 mx-auto text-indigo-600" />
                <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {isSignUp ? "Create an account" : "Welcome back"}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-slate-300">
                  {isSignUp
                    ? "Start your journey to find the perfect remote job"
                    : "Sign in to access your account"}
                </p>
              </div>
              <div className="p-6 rounded-lg shadow md:p-8 bg-slate-200/90 dark:bg-slate-900/90">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {" "}
                  {/* {isSignUp && (
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
                  )} */}
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
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  {isSignUp && (
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className={labelClassName}
                      >
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
                            e.target.setCustomValidity(
                              "Passwords do not match"
                            );
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
                    className="w-full px-4 py-2 text-white transition-all duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="transition-colors duration-200"
                  >
                    {isSignUp ? (
                      <p className="text-gray-600 dark:text-slate-400">
                        Already have an account?{" "}
                        <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                          Sign in
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-600 direction-alternate dark:text-slate-400">
                        Don't have an account?{" "}
                        <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                          Sign up
                        </span>
                      </p>
                    )}
                  </span>
                </div>
              </div>
            </div>
            {/* User Review Carousel */}
            <div className="flex items-center justify-center flex-1 min-w-[260px] max-w-md">
              <div className="w-full">
                <UserReviewCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CONTENT IDEAS FOR BOOSTING USER ENGAGEMENT ---
// 1. Add a "Why Join Ravenz?" section with animated icons and quick value props (e.g. global remote jobs, fast application, supportive community).
// 2. Add a "Success Stories" or "Featured Hires" section with real user photos and quotes.
// 3. Add a "Getting Started" checklist or progress bar for new users.
// 4. Add a "Refer a Friend" call-to-action with rewards.
// 5. Add a "Live Chat" or "Need Help?" widget for instant support.
// 6. Add a "Featured Companies" carousel with logos and short blurbs.
// 7. Add a "Security & Privacy" badge section to build trust.
// 8. Add a "Join Our Community" invite with a link to a Discord/Slack/Forum.
// 9. Add a "Mobile App Coming Soon" teaser with signup for updates.
// 10. Add a "FAQ" accordion for common new-user questions.
// 11. Include a visually appealing background or animation behind the auth form.
