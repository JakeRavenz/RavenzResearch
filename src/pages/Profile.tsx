import React, { useEffect, useState } from "react";
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
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const fullName = [profile?.first_name, profile?.middle_name, profile?.surname]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full max-w-screen-xl px-4 py-8 mx-auto sm:px-6 lg:px-8 bg-slate-100 dark:bg-gray-900">
      {/* Card 1: Header (Avatar, Name, Buttons) */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-wrap items-start justify-between gap-4 md:flex-nowrap">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="object-cover w-20 h-20 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-700">
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
                className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Update Profile
              </button>
              {/* <button
                onClick={handleMyJobs}
                className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                My Jobs
              </button> */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
        </div>
      </div>

      {/* Card 2: Personal Information */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="pb-2 mb-4 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="Gender" value={profile?.gender} />
          <ProfileField
            label="Date of Birth"
            value={profile?.date_of_birth}
          />
          <ProfileField
            label="Phone Number"
            value={profile?.phone_number}
          />
          <ProfileField
            label="Education Level"
            value={
              profile?.education
                ? EDUCATION_LABELS[profile.education]
                : null
            }
          />
          {/* <ProfileField label="ID Type" value={profile?.id_type} />
          <ProfileField label="ID Number" value={profile?.id_number} /> */}
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
      </div>

      {/* Card 3: Address Information */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
      </div>

      {/* Card 4: Documents */}
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
            <p className="text-gray-500 dark:text-gray-400">No resume uploaded</p>
          )}
          </div>
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
    <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h3>
    <p className="text-gray-600 dark:text-gray-400">{value || "Not provided"}</p>
  </div>
);
