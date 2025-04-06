import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';
import 'react-phone-number-input/style.css';

type EducationLevel = 'high_school' | 'associates' | 'bachelors' | 'masters' | 'phd' | 'other';

const EDUCATION_LABELS: Record<EducationLevel, string> = {
  high_school: 'High School',
  associates: 'Associate\'s Degree',
  bachelors: 'Bachelor\'s Degree',
  masters: 'Master\'s Degree',
  phd: 'PhD / Doctorate',
  other: 'Other'
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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
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
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to logout');
    }
  };

  const handleUpdateProfile = () => {
    navigate('/jobs/apply');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const fullName = [profile?.first_name, profile?.middle_name, profile?.surname]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Header section with avatar and name */}
          <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {fullName || 'No name provided'}
                </h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateProfile}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile content sections */}
          <div className="mt-6 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">
                {profile?.bio || 'No bio information provided'}
              </p>
            </section>

            {/* Personal Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  value={profile?.education ? EDUCATION_LABELS[profile.education] : null} 
                />
                <ProfileField 
                  label="ID Type" 
                  value={profile?.id_type} 
                />
                <ProfileField 
                  label="ID Number" 
                  value={profile?.id_number} 
                />
                <ProfileField 
                  label="Work Experience" 
                  value={profile?.work_experience} 
                />
              </div>
            </section>

            {/* Address Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Address Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField 
                  label="Street Address" 
                  value={profile?.address} 
                />
                <ProfileField 
                  label="City" 
                  value={profile?.city} 
                />
                <ProfileField 
                  label="State/Province/Region" 
                  value={profile?.region} 
                />
                <ProfileField 
                  label="Postal/Zip Code" 
                  value={profile?.postal_code} 
                />
                <ProfileField 
                  label="Country" 
                  value={profile?.country} 
                />
              </div>
            </section>

            {/* Documents */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Documents</h2>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resume</h3>
                {profile?.resume_url ? (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center"
                  >
                    View Resume
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
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
    <h3 className="text-sm font-medium text-gray-700 mb-1">{label}</h3>
    <p className="text-gray-600">{value || 'Not provided'}</p>
  </div>
);