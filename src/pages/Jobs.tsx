import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, MapPin, Clock, Building } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

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
  company: {
    name: string;
    logo_url: string;
  };
}

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            company:companies(name, logo_url)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New jobs</h1>
        <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
          See all jobs →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-2 text-gray-600">Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex items-start space-x-4">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={`${job.company.name} logo`}
                    className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                      <p className="text-gray-600">{job.company.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {job.salary_min === job.salary_max 
                          ? `${job.salary_min}k USD`
                          : `${job.salary_min}k - ${job.salary_max}k USD`}
                        <span className="text-gray-600 text-sm">/year</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.remote_level === 'fully_remote' ? 'Remote' : job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTimeAgo(job.created_at)}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        job.remote_level === 'fully_remote'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {job.remote_level === 'fully_remote'
                        ? 'fully remote'
                        : 'remote - United States only'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
