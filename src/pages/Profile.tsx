import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  first_name: string;
  middle_name: string;
  surname: string;
  date_of_birth: string;
  address: string;
  phone_number: string;
  zip_code: string;
  work_experience: string;
  resume_url: string;
  headline: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  available_for_hire: boolean;
  id_type: string;
  id_number: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  // We'll store all fields in formData using the same keys as in our database
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (error) throw error;
        setProfile(data);
        setFormData(data || {});
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  async function handleSave() {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...formData,
          id: profile?.id,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      setProfile({ ...profile, ...formData } as Profile);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to logout');
    } else {
      navigate('/auth');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    // Responsive container: full width on small screens and constrained on larger screens.
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.first_name} ${profile.surname}`}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex flex-col md:flex-row gap-2">
                  {editing ? (
                    <input
                      type="text"
                      value={formData.first_name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="border-gray-300 rounded-md p-1"
                      placeholder="First name"
                    />
                  ) : (
                    profile?.first_name
                  )}{' '}
                  {editing ? (
                    <input
                      type="text"
                      value={formData.middle_name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, middle_name: e.target.value })
                      }
                      className="border-gray-300 rounded-md p-1"
                      placeholder="Middle name"
                    />
                  ) : (
                    profile?.middle_name
                  )}{' '}
                  {editing ? (
                    <input
                      type="text"
                      value={formData.surname || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, surname: e.target.value })
                      }
                      className="border-gray-300 rounded-md p-1"
                      placeholder="Surname"
                    />
                  ) : (
                    profile?.surname
                  )}
                </h1>
                <p className="mt-1 text-gray-600">
                  {editing ? (
                    <input
                      type="text"
                      value={formData.headline || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, headline: e.target.value })
                      }
                      className="border-gray-300 rounded-md p-1"
                      placeholder="Headline"
                    />
                  ) : (
                    profile?.headline || 'Add a headline'
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => (editing ? handleSave() : setEditing(true))}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors mt-4 md:mt-0"
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors mt-4 md:mt-0"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* About */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
              {editing ? (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="mt-2 w-full border-gray-300 rounded-md p-2"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="mt-2 text-gray-600">
                  {profile?.bio || 'Add your bio'}
                </p>
              )}
            </div>

            {/* Contact & Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  Date of Birth
                </h2>
                {editing ? (
                  <input
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, date_of_birth: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.date_of_birth}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  Phone Number
                </h2>
                {editing ? (
                  <input
                    type="text"
                    value={formData.phone_number || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                    placeholder="Phone Number"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.phone_number}
                  </p>
                )}
              </div>
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-sm font-medium text-gray-700">Address</h2>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                    placeholder="Address"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.address}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  Zip Code
                </h2>
                {editing ? (
                  <input
                    type="text"
                    value={formData.zip_code || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, zip_code: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                    placeholder="Zip Code"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.zip_code}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  Work Experience
                </h2>
                {editing ? (
                  <input
                    type="text"
                    value={formData.work_experience || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, work_experience: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                    placeholder="Work Experience"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.work_experience}
                  </p>
                )}
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  ID Type
                </h2>
                {editing ? (
                  <input
                    type="text"
                    value={formData.id_type || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, id_type: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                    placeholder="ID Type"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.id_type}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-700">
                  ID Number
                </h2>
                {editing ? (
                  <input
                    type="text"
                    value={formData.id_number || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, id_number: e.target.value })
                    }
                    className="mt-1 w-full border-gray-300 rounded-md p-1"
                    placeholder="ID Number"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {profile?.id_number}
                  </p>
                )}
              </div>
            </div>

            {/* Skills Section is handled above already */}
          </div>

          <div className="mt-6 flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">
              Available for Hire: {profile?.available_for_hire ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
