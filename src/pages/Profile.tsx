import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Briefcase, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  available_for_hire: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="border-gray-300 rounded-md"
                      placeholder="Your name"
                    />
                  ) : (
                    profile?.full_name || 'Add your name'
                  )}
                </h1>
                <p className="mt-1 text-gray-600">
                  {editing ? (
                    <input
                      type="text"
                      value={formData.headline || ''}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="border-gray-300 rounded-md"
                      placeholder="Your headline"
                    />
                  ) : (
                    profile?.headline || 'Add a headline'
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
            {editing ? (
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-2 w-full border-gray-300 rounded-md"
                rows={4}
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="mt-2 text-gray-600">{profile?.bio || 'Add your bio'}</p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
            {editing ? (
              <input
                type="text"
                value={formData.skills?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                className="mt-2 w-full border-gray-300 rounded-md"
                placeholder="Add skills (comma separated)"
              />
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {profile?.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                )) || 'Add your skills'}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Job Applications</span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Company Profile</span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">Create Company</button>
          </div>
        </div>
      </div>
    </div>
  );
}