import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";

interface Applications {
  id: string;
  job_id: string;
  job_title: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}
interface Job {
  id: string;
  company: {
    logo_url: string;
    name: string;
  };
}
export default function MyJobs() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Applications[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingJobDetails, setLoadingJobDetails] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<Job[]>([]);
  // --- Analytics State ---
  const [analytics, setAnalytics] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    acceptanceRate: 0,
    avgResponseDays: 0,
  });

  // Fetching the applications from the database
  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoadingApplications(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error("Error fetching user:", authError);
          navigate("/auth");
          return;
        }
        const { data, error } = await supabase
          .from("applications")
          .select("id, job_id, job_title, status, created_at, user_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setApplications(data || []);
        // --- Analytics Calculation ---
        if (data && data.length > 0) {
          const total = data.length;
          const accepted = data.filter((a) => a.status === "accepted").length;
          const rejected = data.filter((a) => a.status === "rejected").length;
          const pending = data.filter((a) => a.status === "pending").length;
          const acceptanceRate =
            total > 0 ? Math.round((accepted / total) * 100) : 0;
          setAnalytics({
            total,
            accepted,
            rejected,
            pending,
            acceptanceRate,
            avgResponseDays: 0,
          });
        } else {
          setAnalytics({
            total: 0,
            accepted: 0,
            rejected: 0,
            pending: 0,
            acceptanceRate: 0,
            avgResponseDays: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoadingApplications(false);
      }
    }
    fetchApplications();
  }, [navigate]);
  const jobIds = React.useMemo(
    () => applications.map((app) => app.job_id),
    [applications]
  );

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select(`id, company:companies(logo_url, name)`)
          .in("id", jobIds)
          .order("created_at", { ascending: false });
        // Check if there was an error fetching the job details
        if (error) throw error;
        setJobDetails(
          data.map((job) => ({
            ...job,
            company: Array.isArray(job.company) ? job.company[0] : job.company,
          }))
        ); // Set job details in state
        setLoadingJobDetails(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoadingJobDetails(false);
      }
    }
    fetchJobDetails();
  }, [jobIds]);
  // Function to handle canceling an application
  const handleCancelApplication = async (applicationId: string) => {
    try {
      setCancelling(applicationId);
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId);

      if (error) {
        console.error(
          `Error cancelling application with ID ${applicationId}:`,
          error
        );
        throw error;
      }

      setApplications(
        applications?.filter((app) => app.id !== applicationId) || []
      );
      toast.success("Application cancelled successfully");
    } catch (error) {
      console.error("Error cancelling application:", error);
      toast.error("Failed to cancel application");
    } finally {
      setCancelling(null);
    }
  };

  if (loadingApplications || loadingJobDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 mx-auto bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <Briefcase className="w-16 h-16 mx-auto mt-6 mb-6 text-gray-400 dark:text-gray-500" />
          <div className="w-8 h-8 mx-auto border-4 border-indigo-600 rounded-full dark:border-indigo-400 animate-spin border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading job applications...
          </p>
        </div>
      </div>
    );
  }
  // If there are no applications, show a message
  if (applications?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-100 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          No Applications Found
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          You have not applied for any jobs yet.
        </p>
      </div>
    );
  }
  // --- Application Analytics Section ---
  return (
    <div className="relative w-full p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <div className="relative z-10 flex flex-col items-center max-w-5xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white">
          My Jobs
        </h1>
        {/* Analytics Section */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 mx-auto mb-8 md:grid-cols-3 justify-items-center">
          <div className="flex flex-col items-center w-full max-w-xs p-4 bg-white shadow rounded-xl dark:bg-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Applications
            </div>
            <div className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {analytics.total}
            </div>
          </div>
          <div className="flex flex-col items-center w-full max-w-xs p-4 bg-white shadow rounded-xl dark:bg-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Accepted
            </div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {analytics.accepted}
            </div>
          </div>
          <div className="flex flex-col items-center w-full max-w-xs p-4 bg-white shadow rounded-xl dark:bg-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Acceptance Rate
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.acceptanceRate}%
            </div>
          </div>
        </div>
        {/* Applications Grid */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
          {applications?.map((application) => {
            const job = jobDetails.find((job) => job.id === application.job_id);
            // --- Progress Tracker ---
            let progress = 33;
            let progressColor = "bg-yellow-400";
            let progressLabel = "Pending";
            if (application.status === "accepted") {
              progress = 100;
              progressColor = "bg-green-500";
              progressLabel = "Accepted";
            } else if (application.status === "rejected") {
              progress = 100;
              progressColor = "bg-red-500";
              progressLabel = "Rejected";
            }
            return (
              <div
                key={application.id}
                className="flex flex-col p-5 overflow-hidden transition-shadow bg-white border border-gray-100 shadow-md cursor-pointer dark:bg-gray-800 dark:border-gray-700 rounded-2xl group hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-900/40 focus-within:shadow-2xl focus-within:-translate-y-1 focus-within:border-blue-400 dark:focus-within:border-blue-400 focus-within:bg-blue-50/60 dark:focus-within:bg-blue-900/40"
                onClick={() => navigate(`/jobs/${application.job_id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/jobs/${application.job_id}`);
                  }
                }}
                aria-label={`View job: ${application.job_title}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {job?.company.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={`${job.company.name} logo`}
                      className="object-cover w-10 h-10 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-700">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-gray-900 truncate dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {application.job_title}
                    </div>
                    <div className="text-xs text-gray-500 truncate dark:text-gray-400">
                      {job?.company.name || "Unknown Company"}
                    </div>
                  </div>
                </div>
                {/* Progress Tracker */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                    <span
                      className={`text-xs font-semibold ${progressColor.replace(
                        "bg",
                        "text"
                      )}`}
                    >
                      {progressLabel}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                {/* Quick Actions */}
                <div
                  className="flex justify-between gap-4 mb-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate(`/jobs/${application.job_id}`)}
                    className="px-2 py-1 text-xs font-semibold text-blue-600 transition bg-blue-100 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900"
                  >
                    View Job
                  </button>
                  <button
                    onClick={() => handleCancelApplication(application.id)}
                    className={`px-2 py-1 text-xs font-semibold text-red-600 transition bg-red-100 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900 ${
                      cancelling === application.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={cancelling === application.id}
                  >
                    {cancelling === application.id
                      ? "Cancelling..."
                      : "Withdraw"}
                  </button>
                </div>
                <div className="flex-1" />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Applied on{" "}
                    {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
