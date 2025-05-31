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

        // Check if there was an error fetching the applications)
        if (error) throw error;
        setApplications(data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoadingApplications(false);
      }
    }

    fetchApplications();
  }, [navigate]);
  const jobIds = React.useMemo(() => applications.map((app) => app.job_id), [applications]);

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
  // If there are applications, display them

  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        My Jobs
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {applications?.map((application) => {
          const job = jobDetails.find((job) => job.id === application.job_id);
          return (
            <div
              key={application.id}
              className="flex flex-col p-5 overflow-hidden transition-shadow bg-white border border-gray-100 shadow-md cursor-pointer dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl group"
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
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === "accepted"
                      ? "bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300"
                      : application.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-300"
                  }`}
                >
                  {application.status}
                </span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Applied on{" "}
                  {new Date(application.created_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleCancelApplication(application.id)}
                  className={`text-red-600 hover:text-red-900 text-xs font-semibold ${
                    cancelling === application.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={cancelling === application.id}
                >
                  {cancelling === application.id ? "Cancelling..." : "Cancel"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
