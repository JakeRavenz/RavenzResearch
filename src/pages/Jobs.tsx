import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Briefcase,
  MapPin,
  Clock,
  Building,
  Filter,
  Search,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);
  const jobsPerPage = 10; // Number of jobs to display per page

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);

        // Get the status query parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get("status");

        const query = supabase
          .from("jobs")
          .select(
            `
            *,
            company:companies(name, logo_url)
          `,
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
          .range(0, jobsPerPage);

        // Apply status filter if it exists
        if (status) {
          query.eq("status", status);
        } else {
          query.eq("status", "Open");
        }

        const { data, error, count } = await query;

        if (error) throw error;
        setJobs(data || []);

        // Check if there are more jobs than the current page limit
        setHasMoreJobs(count !== null && count > jobsPerPage);
      } catch (error) {
        console.error("Error fetching jobs:", error);
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
        .from("jobs")
        .select(
          `
          *,
          company:companies(name, logo_url)
        `,
          { count: "exact" }
        )
        .eq("status", "Open")
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      if (data && data.length > 0) {
        setJobs([...jobs, ...data]);
        setCurrentPage(nextPage);

        // Check if there are more jobs to load
        setHasMoreJobs(count !== null && count > startRange + data.length);
      } else {
        setHasMoreJobs(false);
      }
    } catch (error) {
      console.error("Error loading more jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? "just now" : `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return diffInDays === 1 ? "yesterday" : `${diffInDays} days ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const JobSkeletonLoader = () => (
    <div className="p-6 bg-white rounded-lg animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="w-3/4">
              <div className="w-3/4 h-5 mb-2 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/4">
              <div className="w-full h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="mt-4">
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full px-0 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      {/* Top navigation cards/sections */}
      <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-3">
        {/* Applied Jobs Card */}
        <div
          className="flex flex-col items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-lg dark:border-gray-700 group"
          onClick={() => navigate("/myJobs")}
        >
          <Briefcase className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-400" />
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            Applied Jobs
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            View jobs you have applied for
          </p>
        </div>
        {/* Active Jobs Card */}
        <div
          className="flex flex-col items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-lg dark:border-gray-700 group"
          onClick={() => navigate("/myJobs?status=active")}
        >
          <Briefcase className="w-8 h-8 mb-2 text-green-600 dark:text-green-400" />
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            Active Jobs
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            See jobs you are currently working on
          </p>
        </div>
        {/* Completed Jobs Card */}
        <div
          className="flex flex-col items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-lg dark:border-gray-700 group"
          onClick={() => navigate("/myJobs?status=completed")}
        >
          <Briefcase className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            Completed Jobs
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Review jobs you have finished
          </p>
        </div>
      </div>

      {/* Available Jobs Section */}
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Available Jobs
      </h2>
      <div className="flex flex-col items-start justify-between gap-4 px-5 mb-6 md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-4 p-4 mx-1 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Type
            </label>
            <select className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <select className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="us">United States</option>
              <option value="europe">Europe</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Remote Level
            </label>
            <select className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Any</option>
              <option value="fully_remote">Fully Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          {/* Add another filter option if needed to make it 4 columns */}
        </div>
      )}

      <div className="flex items-center justify-between px-5 mb-6">
        <div className="text-gray-600 dark:text-gray-400">
          {loading && jobs.length === 0
            ? "Loading jobs..."
            : `${filteredJobs.length} jobs found`}
        </div>
        <Link
          to="/jobs"
          className="flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group"
        >
          View all jobs
          <span className="ml-1 transition-transform transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Jobs grid (masonry/tiles) */}
      <div className="space-y-4">
        {loading && jobs.length === 0 ? (
          <>
            <JobSkeletonLoader />
            <JobSkeletonLoader />
            <JobSkeletonLoader />
          </>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400" />
            <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">
              No jobs found
            </h3>
            <p className="max-w-md mx-auto mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search criteria or check back later for new opportunities."
                : "We don't have any open positions right now. Please check back soon for new opportunities."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col overflow-hidden transition-shadow bg-white border border-gray-100 shadow-md cursor-pointer dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl group"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {job.company.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={`${job.company.name} logo`}
                      className="object-cover w-12 h-12 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg dark:bg-gray-700">
                      <Briefcase className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 truncate dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {job.title}
                    </h2>
                    <div className="text-xs text-gray-500 truncate dark:text-gray-400">
                      {job.company.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-2 p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs font-medium text-yellow-800 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-700/30 rounded-full">
                      {job.remote_level}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium text-purple-800 bg-purple-100 dark:text-purple-300 dark:bg-purple-700/30 rounded-full">
                      {job.type}
                    </span>
                    {(new Date().getTime() -
                      new Date(job.created_at).getTime()) /
                      (1000 * 60 * 60 * 24) <
                      7 && (
                      <span className="px-2 py-0.5 text-xs font-medium text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mb-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {job.description}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                      {job.salary_min === job.salary_max
                        ? `${job.salary_min} USD`
                        : `${job.salary_min} - ${job.salary_max} USD`}
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        per hour
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Only show the "Load more jobs" button when there are more jobs to load and not currently loading */}
      {!loading && filteredJobs.length > 0 && hasMoreJobs && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
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
