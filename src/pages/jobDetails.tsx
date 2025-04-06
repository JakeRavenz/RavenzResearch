import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Briefcase, MapPin, Clock, Building, ArrowLeft, DollarSign } from 'lucide-react';

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <p className="text-gray-800 text-center">{message}</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setModalMessage("Please login to apply for this position");
      setShowModal(true);
      return;
    }
  
    // Check profile completeness
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
  
    if (error || !profile?.first_name || !profile?.surname) {
      setModalMessage("You need to complete your profile before applying.");
      setShowModal(true);
      return;
    }
  
    // Check existing application
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('job_id', id)
      .eq('user_id', user.id);
  
    if (count && count > 0) {
      setModalMessage("You've already applied to this position");
      setShowModal(true);
      setApplyDisabled(true);
      return;
    }
  
    const { error: applyError } = await supabase
    .from('applications')
    .insert([{ 
      job_id: id,
      user_id: user.id,
      status: 'pending' 
    }]);
  
    if (applyError) {
      setModalMessage("Application failed: " + applyError.message);
      setShowModal(true);
      return;
    }
  
    setModalMessage("✅ Application submitted successfully!");
    setShowModal(true);
    setApplyDisabled(true);
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="mt-6 text-xl font-semibold text-gray-900">Job not found</h3>
          <p className="mt-2 text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
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
              navigate(`/jobs/apply`);
            }
          }}
        />
      )}
      
      {/* Header with Back Button */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Jobs</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Job Header */}
          <div className="p-6 sm:p-8 border-b">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={`${job.company.name} logo`}
                    className="h-20 w-20 rounded-lg object-cover shadow-sm"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
                    <Building className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Job Info */}
              <div className="flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
                <div className="text-lg sm:text-xl text-gray-700 mt-1 mb-4">{job.company.name}</div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{job.remote_level === 'fully_remote' ? 'Remote' : job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Posted {formatTimeAgo(job.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                   
                    <span>${job.salary_min}k - ${job.salary_max}k per year</span>
                  </div>
                </div>
              </div>

              {/* Apply Button - Desktop */}
              <div className="hidden md:block flex-shrink-0 ml-auto">
                <button
                  onClick={handleApplyNow}
                  disabled={applyDisabled}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Apply Now
                </button>
              </div>
            </div>
            
            {/* Apply Button - Mobile */}
            <div className="mt-6 md:hidden">
              <button
                onClick={handleApplyNow}
                disabled={applyDisabled}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6 sm:p-8">
            <div className="space-y-10">
              {/* About the Role */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">About the Role</span>
                  <span className="flex-grow border-t border-gray-200 ml-3"></span>
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  {job.description}
                </div>
              </section>
              
              {/* Requirements */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">Requirements</span>
                  <span className="flex-grow border-t border-gray-200 ml-3"></span>
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {job.requirements && job.requirements.length > 0 ? (
                    job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                      <span>No specific requirements listed.</span>
                    </li>
                  )}
                </ul>
              </section>
              
              {/* What We Offer */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">What We Offer</span>
                  <span className="flex-grow border-t border-gray-200 ml-3"></span>
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {job.what_we_offer && job.what_we_offer.length > 0 ? (
                    job.what_we_offer.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></span>
                        <span>{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></span>
                      <span>No benefits information provided.</span>
                    </li>
                  )}
                </ul>
              </section>
            </div>

            {/* Apply Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to join {job.company.name}?</h2>
                    <p className="text-gray-700">Submit your application today and take the next step in your career.</p>
                  </div>
                  <button
                    onClick={handleApplyNow}
                    disabled={applyDisabled}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex-shrink-0"
                  >
                    {applyDisabled ? 'Applied' : 'Apply for this position'}
                  </button>
                </div>
              </div>
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
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours === 1) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
}