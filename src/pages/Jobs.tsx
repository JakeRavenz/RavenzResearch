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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  // TruncatedDescription component (copied from jobDetails for consistency)
  function TruncatedDescription({
    description,
    jobId,
    companyName,
    jobTitle,
  }: {
    description: string;
    jobId: string;
    companyName: string;
    jobTitle: string;
  }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 100; // Match jobDetails truncation

    const showTruncate = description.length > maxLength && !isExpanded;

    return (
      <div className="mt-1 text-gray-600 dark:text-gray-400">
        {isExpanded || description.length <= maxLength
          ? description
          : `${description.slice(0, maxLength)}...`}
        {showTruncate && (
          <Link
            to={`/jobs/${jobId}`}
            className="flex-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors bg-indigo-100 rounded-md shadow-sm hover:bg-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 text-center"
            onClick={(e) => e.stopPropagation()}
            aria-label={t("jobs_page.learn_more", { jobTitle, companyName })}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("jobs_page.learn_more")}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto bg-slate-300 dark:bg-slate-900">
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          {/* Top navigation cards/sections */}
          <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Applied Jobs Card */}
            <div
              className="flex flex-col items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-lg dark:border-gray-700 group"
              onClick={() => navigate("/myJobs")}
            >
              <Briefcase className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                {t("jobs_page.applied_jobs")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("jobs_page.applied_jobs_desc")}
              </p>
            </div>
            {/* Active Jobs Card */}
            <div
              className="flex flex-col items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-lg dark:border-gray-700 group"
              onClick={() => navigate("/myJobs?status=active")}
            >
              <Briefcase className="w-8 h-8 mb-2 text-green-600 dark:text-green-400" />
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                {t("jobs_page.active_jobs")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("jobs_page.active_jobs_desc")}
              </p>
            </div>
            {/* Completed Jobs Card */}
            <div
              className="flex flex-col items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-lg dark:border-gray-700 group"
              onClick={() => navigate("/myJobs?status=completed")}
            >
              <Briefcase className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                {t("jobs_page.completed_jobs")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("jobs_page.completed_jobs_desc")}
              </p>
            </div>
          </div>

          {/* Available Jobs Section */}
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            {t("jobs_page.available_jobs")}
          </h2>
          <div className="flex flex-col items-start justify-between gap-4 px-5 mb-6 md:flex-row md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder={t("jobs_page.search_placeholder")}
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
              {t("jobs_page.filters")}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 p-4 mx-1 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("jobs_page.job_type")}
                </label>
                <select className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="">{t("jobs_page.all_types")}</option>
                  <option value="full_time">{t("jobs_page.full_time")}</option>
                  <option value="part_time">{t("jobs_page.part_time")}</option>
                  <option value="contract">{t("jobs_page.contract")}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("jobs_page.location")}
                </label>
                <select className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="">{t("jobs_page.all_locations")}</option>
                  <option value="remote">{t("jobs_page.remote")}</option>
                  <option value="us">{t("jobs_page.us")}</option>
                  <option value="europe">{t("jobs_page.europe")}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("jobs_page.remote_level")}
                </label>
                <select className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="">{t("jobs_page.any")}</option>
                  <option value="fully_remote">
                    {t("jobs_page.fully_remote")}
                  </option>
                  <option value="hybrid">{t("jobs_page.hybrid")}</option>
                  <option value="onsite">{t("jobs_page.onsite")}</option>
                </select>
              </div>
              {/* Add another filter option if needed to make it 4 columns */}
            </div>
          )}

          <div className="flex items-center justify-between px-5 mb-6">
            <div className="text-gray-600 dark:text-gray-400">
              {loading && jobs.length === 0
                ? t("jobs_page.loading_jobs")
                : t("jobs_page.jobs_found", { count: filteredJobs.length })}
            </div>
            <Link
              to="/jobs"
              className="flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group"
            >
              {t("jobs_page.view_all_jobs")}
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
                  {t("jobs_page.no_jobs_found")}
                </h3>
                <p className="max-w-md mx-auto mt-2 text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? t("jobs_page.try_adjusting")
                    : t("jobs_page.no_open_positions")}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {t("jobs_page.clear_search")}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col overflow-hidden transition-shadow bg-white border border-gray-100 shadow-md cursor-pointer dark:bg-gray-800 dark:border-gray-700 rounded-2xl group hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-400 hover:scale-[1.03] hover:-translate-y-1 duration-300"
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
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900">
                          <Briefcase className="w-6 h-6 text-indigo-400" />
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
                    <div className="flex flex-col flex-1 gap-2 p-6">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 dark:from-yellow-700 dark:via-yellow-800 dark:to-yellow-900 rounded-full">
                          {t(`jobs_page.${job.remote_level?.replace(/ /g, "_").toLowerCase()}`, job.remote_level)}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 dark:from-purple-700 dark:via-purple-800 dark:to-purple-900 rounded-full">
                          {t(
                            `jobs_page.${job.type?.replace(/ /g, "_").toLowerCase()}`,
                            job.type
                          )}
                        </span>
                        {(new Date().getTime() -
                          new Date(job.created_at).getTime()) /
                          (1000 * 60 * 60 * 24) <
                          7 && (
                          <span className="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 dark:from-pink-700 dark:via-pink-800 dark:to-pink-900 rounded-full animate-pulse">
                            {t("jobs_page.new")}
                          </span>
                        )}
                      </div>
                      <div className="mb-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        <TruncatedDescription
                          description={job.description}
                          jobId={job.id}
                          companyName={job.company.name}
                          jobTitle={job.title}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-auto mb-2">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {job.salary_max ? `${job.salary_max} USD` : ""}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            {job.salary_max ? t("jobs_page.per_hour") : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="flex-1 px-3 py-1.5 text-xs font-semibold text-white transition-colors bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 text-center"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={t("jobs_page.apply", {
                            jobTitle: job.title,
                            companyName: job.company.name,
                          })}
                        >
                          {t("jobs_page.apply")}
                        </Link>
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
                {loading
                  ? t("jobs_page.loading")
                  : t("jobs_page.load_more_jobs")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
