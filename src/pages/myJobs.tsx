import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  }, [navigate, toast]);
  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const jobIds = applications.map((app) => app.job_id); // Extract job IDs from applications
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
  }, [
    React.useMemo(() => applications.map((app) => app.job_id), [applications]),
  ]);
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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="loader"></div>
        <p className="mt-4 text-gray-600">Loading your applications...</p>
      </div>
    );
  }
  // If there are no applications, show a message
  if (applications?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          No Applications Found
        </h2>
        <p className="mt-4 text-gray-600">
          You have not applied for any jobs yet.
        </p>
      </div>
    );
  }
  // If there are applications, display them

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Jobs</h1>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Applications
          </h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">
            Here are the jobs you have applied for.
          </p>
        </div>
        <div className="flex-col border-t border-gray-200 lg:flex-row lg:items-center lg:justify-center">
          <dl className="divide-y divide-gray-200">
            {applications?.map((application) => (
              <div
                key={application.id}
                className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt className="text-sm font-medium text-gray-500">
                  <div className="flex items-center space-x-2">
                    {jobDetails.map((job) => {
                      if (job.id === application.job_id) {
                        return (
                          <div
                            key={job.id}
                            className="flex items-center space-x-2"
                          >
                            {job.company.logo_url ? (
                              <img
                                src={job.company.logo_url}
                                alt={`${job.company.name} logo`}
                                className="object-cover w-8 h-8 rounded-lg"
                              />
                            ) : null}
                            <span>{application.job_title}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 ">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : application.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application.status}
                    </span>
                    <button
                      onClick={() => handleCancelApplication(application.id)}
                      className={`text-red-600 hover:text-red-900 ${
                        cancelling === application.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={cancelling === application.id}
                    >
                      {cancelling === application.id
                        ? "Cancelling..."
                        : "Cancel Application"}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Applied on{" "}
                    {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
