import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import "react-phone-number-input/style.css";
import { PayPalIcon, AirTMIcon, PayoneerIcon } from "../assets/icons";

type EducationLevel =
  | "high_school"
  | "associates"
  | "bachelors"
  | "masters"
  | "phd"
  | "other";

const EDUCATION_LABELS: Record<EducationLevel, string> = {
  high_school: "High School",
  associates: "Associate's Degree",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  phd: "PhD / Doctorate",
  other: "Other",
};

const PAYMENT_METHOD_LABELS: Record<string, React.ReactNode> = {
  paypal: (
    <>
      <PayPalIcon />
      PayPal
    </>
  ),
  airtm: (
    <>
      <AirTMIcon />
      Airtm
    </>
  ),
  payoneer: (
    <>
      <PayoneerIcon />
      Payoneer
    </>
  ),
  other: "Other",
};

const getPaymentAccountDetailsLabelForDisplay = (method?: string): string => {
  if (!method) return "Payment Account Details";
  switch (method) {
    case "paypal":
      return "PayPal Email";
    case "payoneer":
      return "Payoneer Email";
    case "airtm":
      return "Airtm Email/Username";
    case "other":
      return "Payment Account Details";
    default:
      return "Account Details";
  }
};

// Extend Profile type to include new fields from Supabase
interface Profile {
  id: string;
  first_name: string;
  middle_name: string;
  surname: string;
  date_of_birth: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  phone_number: string;
  work_experience: string;
  resume_url: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  id_type: string;
  id_number: string;
  education: EducationLevel;
  gender: string; // Add gender field
  payment_method: string;
  payment_account_details?: string;
  gov_id_link?: string;
  gov_id_verified?: boolean;
  compliance_link?: string;
  compliance_verified?: boolean;
  exam_link?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [complianceFailNotified, setComplianceFailNotified] = useState(false);
  const complianceFailToastShown = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // useEffect(() => {
  //   if (
  //     profile?.compliance_link &&
  //     profile?.compliance_verified === false &&
  //     !complianceFailToastShown.current
  //   ) {
  //     toast.error(
  //       "Compliance verification failed. Please review your submission or contact support.",
  //       { id: "compliance-fail" }
  //     );
  //     complianceFailToastShown.current = true;
  //     setComplianceFailNotified(true);
  //   }
  // }, [profile]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to logout");
    }
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };
  // const handleMyJobs = () => {
  //   navigate("/myJobs");
  // };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-slate-100 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-indigo-600 rounded-full dark:border-indigo-400 animate-spin border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading profile...
        </p>
      </div>
    );
  }

  const fullName = [profile?.first_name, profile?.middle_name, profile?.surname]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative w-full p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <div className="relative z-10 flex flex-col gap-8">
        {/* Card 1: Header (Avatar, Name, Buttons) */}
        <div className="flex flex-col gap-4 p-6 border shadow-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <div className="flex flex-wrap items-start justify-between gap-4 md:flex-nowrap">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="object-cover w-20 h-20 border-4 border-indigo-200 rounded-full shadow-md dark:border-indigo-700"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 border-4 border-indigo-100 rounded-full shadow-md dark:bg-gray-700 dark:border-indigo-800">
                  <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                  {fullName || "No name provided"}
                </h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-md shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md shadow dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Personal Information */}
        <section className="flex flex-col gap-4 p-6 border shadow-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h2 className="pb-2 mb-4 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProfileField label="Gender" value={profile?.gender} />
            <ProfileField
              label="Date of Birth"
              value={profile?.date_of_birth}
            />
            <ProfileField label="Phone Number" value={profile?.phone_number} />
            <ProfileField
              label="Education Level"
              value={
                profile?.education ? EDUCATION_LABELS[profile.education] : null
              }
            />
            <ProfileField
              label="Preferred Payment Method"
              value={
                profile?.payment_method
                  ? PAYMENT_METHOD_LABELS[profile.payment_method]
                  : "Not provided"
              }
            />
            <ProfileField
              label={getPaymentAccountDetailsLabelForDisplay(
                profile?.payment_method
              )}
              value={profile?.payment_account_details}
            />
          </div>
        </section>

        {/* Card 3: Address Information */}
        <section className="flex flex-col gap-4 p-6 border shadow-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h2 className="pb-2 mb-4 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
            Address Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfileField label="Street Address" value={profile?.address} />
            <ProfileField label="City" value={profile?.city} />
            <ProfileField
              label="State/Province/Region"
              value={profile?.region}
            />
            <ProfileField
              label="Postal/Zip Code"
              value={profile?.postal_code}
            />
            <ProfileField label="Country" value={profile?.country} />
          </div>
        </section>

        {/* Card 4: Documents */}
        <section className="flex flex-col gap-4 p-6 border shadow-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h2 className="pb-2 mb-4 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
            Documents
          </h2>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Resume
            </h3>
            {profile?.resume_url ? (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
              >
                View Resume
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No resume uploaded
              </p>
            )}
          </div>
        </section>

        {/* Card 5: Government ID & Compliance */}
        <section className="flex flex-col gap-4 p-6 border shadow-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h2 className="pb-2 mb-4 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
            Government ID & Compliance
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Government ID Section */}
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Government ID
              </h3>
              <button
                type="button"
                disabled={!profile?.gov_id_link}
                onClick={() =>
                  profile?.gov_id_link &&
                  window.open(profile.gov_id_link, "_blank")
                }
                className={`w-full px-4 py-2 rounded-md shadow font-semibold transition-colors ${
                  profile?.gov_id_link
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {profile?.gov_id_link
                  ? "Submit/View Government ID"
                  : "Government ID Unavailable"}
              </button>
              {/* Verification status badges/messages */}
              {profile?.gov_id_link && profile?.gov_id_verified === false && (
                <span className="inline-block px-3 py-1 mt-2 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                  Verification Failed
                </span>
              )}
              {profile?.gov_id_link && profile?.gov_id_verified == null && (
                <span className="inline-block px-3 py-1 mt-2 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                  Not Verified – Please proceed with verification or contact
                  support if unsure.
                </span>
              )}
              {profile?.gov_id_link && profile?.gov_id_verified === true && (
                <span className="inline-block px-3 py-1 mt-2 text-xs text-green-700 bg-green-100 rounded-full">
                  Verified
                </span>
              )}
            </div>
            {/* Compliance Check Section */}
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Compliance Check
              </h3>
              <button
                type="button"
                disabled={
                  !profile?.gov_id_link ||
                  profile?.gov_id_verified !== true ||
                  !profile?.compliance_link
                }
                onClick={() => {
                  let url = profile?.compliance_link;
                  if (url && !/^https?:\/\//i.test(url)) {
                    url = "https://" + url;
                  }
                  if (url && profile?.gov_id_verified === true)
                    window.open(url, "_blank");
                }}
                className={`w-full px-4 py-2 rounded-md shadow font-semibold transition-colors ${
                  !profile?.gov_id_link ||
                  profile?.gov_id_verified !== true ||
                  !profile?.compliance_link
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                }`}
              >
                {!profile?.gov_id_link || profile?.gov_id_verified !== true
                  ? "Compliance Unavailable (ID Not Verified)"
                  : profile?.compliance_link
                  ? "Start Compliance Check"
                  : "Compliance Check Unavailable"}
              </button>
              {/* Verification status badges/messages */}
              {profile?.gov_id_link &&
                profile?.compliance_link &&
                profile?.gov_id_verified === true &&
                profile?.compliance_verified === false && (
                  <span className="inline-block px-3 py-1 mt-2 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                    Verification Failed
                  </span>
                )}
              {profile?.gov_id_link &&
                profile?.compliance_link &&
                profile?.gov_id_verified === true &&
                profile?.compliance_verified == null && (
                  <span className="inline-block px-3 py-1 mt-2 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                    Not Verified – Please proceed with verification or contact
                    support if unsure.
                  </span>
                )}
              {profile?.gov_id_link &&
                profile?.compliance_link &&
                profile?.gov_id_verified === true &&
                profile?.compliance_verified === true && (
                  <span className="inline-block px-3 py-1 mt-2 text-xs text-green-700 bg-green-100 rounded-full">
                    Verified
                  </span>
                )}
            </div>
            {/* Take Exam Section */}
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Take Exam
              </h3>
              {profile?.gov_id_verified &&
              profile?.compliance_verified === true &&
              profile?.exam_link ? (
                <button
                  type="button"
                  onClick={() => window.open(profile.exam_link, "_blank")}
                  className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Start Exam
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full px-4 py-2 font-semibold text-gray-500 bg-gray-300 rounded-md shadow cursor-not-allowed"
                >
                  Exam Unavailable
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Reusable profile field component to maintain consistent styling
interface ProfileFieldProps {
  label: string;
  value: React.ReactNode;
}
const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div>
    <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {value || "Not provided"}
    </p>
  </div>
);
