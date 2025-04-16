import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import "react-phone-number-input/style.css";

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
    navigate("/jobs/apply");
  };
  // const handleMyJobs = () => {
  //   navigate("/myJobs");
  // };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const fullName = [profile?.first_name, profile?.middle_name, profile?.surname]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Header section with avatar and name */}
          <div className="flex flex-wrap items-start justify-between gap-4 md:flex-nowrap">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="object-cover w-20 h-20 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {fullName || "No name provided"}
                </h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Update Profile
              </button>
              {/* <button
                onClick={handleMyJobs}
                className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100"
              >
                My Jobs
              </button> */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile content sections */}
          <div className="mt-6 space-y-8">
            {/* About */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                About
              </h2>
              <p className="text-gray-600">
                {profile?.bio || "No bio information provided"}
              </p>
            </section>

            {/* Personal Information */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <ProfileField label="ID Type" value={profile?.id_type} />
                <ProfileField label="ID Number" value={profile?.id_number} />
                <ProfileField
                  label="Work Experience"
                  value={profile?.work_experience}
                />
              </div>
            </section>

            {/* Address Information */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
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

            {/* Documents */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Documents
              </h2>
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Resume
                </h3>
                {profile?.resume_url ? (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:underline"
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
                  <p className="text-gray-500">No resume uploaded</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable profile field component to maintain consistent styling
interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div>
    <h3 className="mb-1 text-sm font-medium text-gray-700">{label}</h3>
    <p className="text-gray-600">{value || "Not provided"}</p>
  </div>
);
