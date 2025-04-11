import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, MapPin, Clock, Building, Filter, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);
  const jobsPerPage = 10; // Number of jobs to display per page

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const { data, error, count } = await supabase
          .from('jobs')
          .select(`
            *,
            company:companies(name, logo_url)
          `, { count: 'exact' })
          .eq('status', 'Open')
          .order('created_at', { ascending: false })
          .range(0, jobsPerPage);
        
        if (error) throw error;
        setJobs(data || []);
        
        // Check if there are more jobs than the current page limit
        setHasMoreJobs(count !== null && count > jobsPerPage);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  async function loadMoreJobs() {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const startRange = jobs.length;
      const endRange = startRange + jobsPerPage - 1;
      
      const { data, error, count } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(name, logo_url)
        `, { count: 'exact' })
        .eq('status', 'Open')
        .order('created_at', { ascending: false })
        .range(startRange, endRange);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setJobs([...jobs, ...data]);
        setCurrentPage(nextPage);
        
        // Check if there are more jobs to load
        setHasMoreJobs(count !== null && count > (startRange + data.length));
      } else {
        setHasMoreJobs(false);
      }
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? 'just now' : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const JobSkeletonLoader = () => (
    <div className="bg-white rounded-lg p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="w-3/4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-1/4">
              <div className="h-5 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="mt-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full mx-auto px-0 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Discover Opportunities</h1>
        <div className="flex flex-col w-full md:w-auto sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mx-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="us">United States</option>
              <option value="europe">Europe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remote Level</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Any</option>
              <option value="fully_remote">Fully Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 px-1">
        <div className="text-gray-600">
          {loading && jobs.length === 0 ? "Loading jobs..." : `${filteredJobs.length} jobs found`}
        </div>
        <Link 
          to="/jobs" 
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
        >
          View all jobs
          <span className="ml-1 transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="space-y-4">
        {loading && jobs.length === 0 ? (
          <>
            <JobSkeletonLoader />
            <JobSkeletonLoader />
            <JobSkeletonLoader />
          </>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="mt-6 text-xl font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search criteria or check back later for new opportunities."
                : "We don't have any open positions right now. Please check back soon for new opportunities."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              {/* Company Logo - Stack on mobile, side by side on larger screens */}
              <div className="flex-shrink-0 flex justify-center sm:justify-start">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={`${job.company.name} logo`}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                {/* Job Title and Salary - Stack on mobile, side by side on larger screens */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{job.title}</h2>
                    <p className="text-gray-600">{job.company.name}</p>
                  </div>
                  <div className="mt-2 lg:mt-0 lg:text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {job.salary_min === job.salary_max 
                        ? `${job.salary_min} USD`
                        : `${${job.salary_max} USD`}
                      <span className="text-gray-600 text-sm ml-1">per hour</span>
                    </p>
                  </div>
                </div>

                {/* Job Details - Responsive grid for various screen sizes */}
                <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{formatTimeAgo(job.created_at)}</span>
                  </div>
                </div>

                {/* Tags - Wrap on smaller screens */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Yellow tag shows job.remote_level */}
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {job.remote_level}
                  </span>
                  {/* Purple tag shows job.type directly */}
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {job.type}
                  </span>
                  {/* Only show "New" tag if job is less than 7 days old */}
                  {(new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24) < 7 && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Only show the "Load more jobs" button when there are more jobs to load and not currently loading */}
      {!loading && filteredJobs.length > 0 && hasMoreJobs && (
        <div className="mt-8 flex justify-center">
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={loadMoreJobs}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more jobs"}
          </button>
        </div>
      )}
    </div>
  );
}
