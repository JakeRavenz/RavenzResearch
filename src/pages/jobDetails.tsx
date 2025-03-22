import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Briefcase, MapPin, Clock, Building, ArrowLeft } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  location: string;
  type: string;
  remote_level: string;
  created_at: string;
  requirements?: string[];
  what_we_offer?: string[];
  responsibilities?: string[];
  company: {
    name: string;
    logo_url: string;
  };
}

function Modal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [applyDisabled, setApplyDisabled] = useState(false);

  useEffect(() => {
    async function fetchJobDetails() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            company:companies(name, logo_url)
          `)
          .eq('id', id)
          .single();
        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [id]);

  async function handleApplyNow() {
    // Retrieve current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setModalMessage("User not authenticated. Please log in.");
      setShowModal(true);
      return;
    }
    // Check if user's profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (profileError || !profile) {
      setModalMessage("You need to complete your profile before applying.");
      setShowModal(true);
      // Optionally redirect to profile page after closing modal
      return;
    }
    // Check if the user has already applied for this job
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', job?.id)
      .eq('user_id', user.id)
      .single();
    if (!applicationError && application) {
      setModalMessage("You have already applied for this job.");
      setShowModal(true);
      setApplyDisabled(true);
      return;
    }
    // Insert application record
    const { error: insertError } = await supabase
      .from('applications')
      .insert([{ job_id: job?.id, user_id: user.id }]);
    if (insertError) {
      setModalMessage("Error applying: " + insertError.message);
      setShowModal(true);
      return;
    }
    setModalMessage("Application submitted successfully!");
    setShowModal(true);
    setApplyDisabled(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Job not found</h3>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => {
            setShowModal(false);
            // If user needs to complete profile, redirect after closing modal
            if (modalMessage === "You need to complete your profile before applying.") {
              navigate('/jobs/apply');
            }
          }}
        />
      )}
      {/* Header with Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Job Header */}
          <div className="flex items-start space-x-6 mb-8">
            {job.company.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={`${job.company.name} logo`}
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Building className="h-10 w-10 text-gray-400" />
              </div>
            )}

            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="text-xl text-gray-600 mb-4">{job.company.name}</div>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.remote_level === 'fully_remote' ? 'Remote' : job.location}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Posted {formatTimeAgo(job.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={handleApplyNow}
                disabled={applyDisabled}
                className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Apply Now
              </button>
              <div className="text-center text-gray-600">
                ${job.salary_min}k - ${job.salary_max}k
                <span className="block text-sm">Per Year</span>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">About the Role</h2>
              <div className="prose max-w-none text-gray-700">{job.description}</div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))
                ) : (
                  <li>No specific requirements listed.</li>
                )}
              </ul>
            </div>
            
            {/* What We Offer Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.what_we_offer && job.what_we_offer.length > 0 ? (
                  job.what_we_offer.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <li>No benefits information provided.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Apply Section */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Interested in this role?</h2>
                <p className="text-gray-600">Apply now and we'll get back to you soon.</p>
              </div>
              <button
                onClick={handleApplyNow}
                disabled={applyDisabled}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Apply for this position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format the "time ago" string
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}