import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Briefcase, MapPin, Clock, Building, ArrowLeft } from "lucide-react";

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
  status: string;
  requirements?: string[];
  what_we_offer?: string[];
  company: {
    name: string;
    logo_url: string;
  };
}

function Modal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <p className="text-center text-gray-800">{message}</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [applyDisabled, setApplyDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchJobDetails() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select(
            `
            id, title, description, salary_min, salary_max, location, type, 
            remote_level, created_at, requirements, what_we_offer, status,
            company:companies(name, logo_url)
          `
          )
          .eq("id", id)
          .eq("status", "Open")
          .single();

        if (error) throw error;
        setJob({
          ...data,
          company: Array.isArray(data.company) ? data.company[0] : data.company,
        });
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [id]);

  async function handleApplyNow() {
    if (isSubmitting) return;
    setIsSubmitting(true);


    try {
      if (!id) {
        setModalMessage("Job ID is missing");
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // Verify the job exists before continuing
      // console.log("Checking if job exists with ID:", id);
      const { data: jobExists, error: jobCheckError } = await supabase
        .from("jobs")
        .select("id, title, company:companies(name, logo_url)")
        .eq("id", id)
        .eq("status", "Open")
        .single();

      if (jobCheckError || !jobExists) {
        // console.log("Job check error or job doesn't exist:", jobCheckError);
        setModalMessage(
          "This job posting no longer exists or is not open for applications"
        );
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // console.log("Job exists:", jobExists);

      // Check if user is logged in
      // console.log("Checking if user is logged in");
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // console.log("User not logged in");
        setModalMessage("Please login to apply for this position");
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // console.log("User is logged in with ID:", user.id);

      // Check profile completeness
      // console.log("Checking profile completeness");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, surname, gender")
        .eq("id", user.id)
        .single();
      // Handle missing profile or incomplete profile data
      if (profileError) {
        console.error("Profile error:", profileError);
        setModalMessage("Please complete your profile before applying");
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // console.log("Retrieved profile:", profile);

      // Check specifically for missing first_name or surname
      if (!profile || !profile.first_name || profile.first_name.trim() === "") {
        // console.log("Missing first name");
        setModalMessage(
          "Please add your first name to your profile before applying"
        );
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }
      // check specifically if profile is verified
      // if (!profile || !profile.verified) {
      //   console.log("Profile not verified");
      //   setModalMessage(
      //     "Please verify your profile before applying for this position"
      //   );
      //   setShowModal(true);
      //   setIsSubmitting(false);
      //   return;
      // }
      if (!profile || !profile.surname || profile.surname.trim() === "") {
        // console.log("Missing surname");
        setModalMessage(
          "Please add your surname to your profile before applying"
        );
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // Prepare cleaned name values
      const trimmedFirstName = profile.first_name.trim();
      const trimmedSurname = profile.surname.trim();
      const gender = profile.gender;

      // console.log("Profile is complete. Names:", {
      //   trimmedFirstName,
      //   trimmedSurname,
      //   gender,
      // });

      // Check existing application
      // console.log("Checking for existing application");
      const { count, error: countError } = await supabase
        .from("applications")
        .select("*", { count: "exact" })
        .eq("job_id", id)
        .eq("user_id", user.id);

      if (countError) {
        console.error("Error checking existing application:", countError);
      }

      if (count && count > 0) {
        // console.log(
        //   "User already applied to this job. Application count:",
        //   count
        // );
        setModalMessage("You've already applied to this position");
        setShowModal(true);
        setApplyDisabled(true);
        setIsSubmitting(false);
        return;
      }

      // Submit application
      // console.log("Submitting application to database");
      const { data: applicationData, error: applyError } = await supabase
        .from("applications")
        .insert([
          {
            job_id: id,
            user_id: user.id,
            email: user.email,
            first_name: trimmedFirstName,
            surname: trimmedSurname,
            status: "pending",
            job_title: jobExists.title,
            gender: gender,
          },
        ])
        .select();

      if (applyError) {
        console.error("Application error:", applyError);

        if (applyError.code === "23505") {
          setModalMessage("You've already applied to this position");
          setShowModal(true);
          setApplyDisabled(true);
          setIsSubmitting(false);
          return;
        } else if (applyError.code === "23503") {
          setModalMessage(
            "Unable to submit application: the job posting may have been removed"
          );
          setShowModal(true);
          setIsSubmitting(false);
          return;
        }

        setModalMessage("Application failed: " + applyError.message);
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // console.log(
      //   "Application added to database successfully:",
      //   applicationData
      // );

      // Send jobapplication success email
      try {
        // console.log("Preparing to send application email notification");
        const email = user.email;

        if (!email) {
          console.error("Email not found in user data");
          setIsSubmitting(false);
          return;
        }

        const companyName = Array.isArray(jobExists.company)
          ? (jobExists.company[0] as { name: string }).name
          : (jobExists.company as { name: string }).name;

        // console.log("Sending email to:", email);
        // console.log("Email data being sent:", {
        //   email,
        //   firstName: trimmedFirstName,
        //   surname: trimmedSurname,
        //   jobTitle: jobExists.title,
        //   jobPosition: companyName,
        //   jobLink: `${window.location.origin}/myjobs`,
        // });

        // console.log(
        //   "About to call API endpoint: /api/send-jobApplication-email"
        // );
        const response = await fetch("/api/send-jobApplication-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName: trimmedFirstName,
            surname: trimmedSurname,
            jobTitle: jobExists.title,
            jobPosition: companyName,
            jobLink: `${window.location.origin}/myjobs`,
          }),
        });

        // console.log("Email API response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Email API error:", errorData);
          // We continue even if email fails, since the application was submitted
        } else {
          const responseData = await response.json();
          // console.log("Email send successful:", responseData);
        }
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // We don't set an error modal here as the application was successful
      }

      // console.log("Setting success message and showing modal");
      setModalMessage("✅ Application submitted successfully!");
      setShowModal(true);
      setApplyDisabled(true);
    } catch (error) {
      console.error("Error in application process:", error);
      setModalMessage("An unexpected error occurred. Please try again later.");
      setShowModal(true);
    } finally {
      // console.log("handleApplyNow function completing");
      setIsSubmitting(false);
    }
  }
  //if (loading) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 mx-auto bg-gray-50">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
          <Briefcase className="w-16 h-16 mx-auto mt-6 mb-6 text-gray-400" />
          <div className="w-8 h-8 mx-auto border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }
  // Check if job does not exists

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
          <Briefcase className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mt-6 text-xl font-semibold text-gray-900">
            Job not found
          </h3>
          <p className="mt-2 text-gray-600">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="w-full px-6 py-3 mt-6 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
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
            if (
              modalMessage ===
                "Please add your first name to your profile before applying" ||
              modalMessage ===
                "Please add your surname to your profile before applying" ||
              modalMessage === "Please complete your profile before applying"
            ) {
              navigate("/profile");
            }
          }}
        />
      )}
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => {
            setShowModal(false);
            // If user needs to login, redirect after closing modal
            if (modalMessage === "Please login to apply for this position") {
              navigate("/auth");
            }
          }}
        />
      )}
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => {
            setShowModal(false);
            // If user needs to login, redirect after closing modal
            if (modalMessage === "✅ Application submitted successfully!") {
              navigate("/myJobs");
            }
          }}
        />
      )}

      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Jobs</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8 sm:py-10">
        <div className="overflow-hidden bg-white shadow-md rounded-xl">
          {/* Job Header */}
          <div className="p-6 border-b sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={`${job.company.name} logo`}
                    className="object-cover w-20 h-20 rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg shadow-sm">
                    <Building className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Job Info */}
              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {job.title}
                </h1>
                <div className="mt-1 mb-4 text-lg text-gray-700 sm:text-xl">
                  {job.company.name}
                </div>

                <div className="flex flex-wrap text-gray-600 gap-y-2 gap-x-6">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    <span>
                      {job.remote_level === "fully_remote"
                        ? "Remote"
                        : job.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Posted {formatTimeAgo(job.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <span>${job.salary_max} per hour</span>
                  </div>
                </div>
              </div>

              {/* Apply Button - Desktop */}
              <div className="flex-shrink-0 hidden ml-auto md:block">
                <button
                  onClick={handleApplyNow}
                  disabled={applyDisabled || isSubmitting}
                  className="w-full px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {isSubmitting
                    ? "Applying..."
                    : applyDisabled
                    ? "Applied"
                    : "Apply Now"}
                </button>
              </div>
            </div>

            {/* Apply Button - Mobile */}
            <div className="mt-6 md:hidden">
              <button
                onClick={handleApplyNow}
                disabled={applyDisabled || isSubmitting}
                className="w-full px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Applying..."
                  : applyDisabled
                  ? "Applied"
                  : "Apply Now"}
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6 sm:p-8">
            <div className="space-y-10">
              {/* About the Role */}
              <section>
                <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                  <span className="mr-2">About the Role</span>
                  <span className="flex-grow ml-3 border-t border-gray-200"></span>
                </h2>
                <div className="leading-relaxed prose text-gray-700 max-w-none">
                  <TruncatedDescription description={job.description} />
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                  <span className="mr-2">Requirements</span>
                  <span className="flex-grow ml-3 border-t border-gray-200"></span>
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {job.requirements && job.requirements.length > 0 ? (
                    job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 inline-block w-2 h-2 mt-2 mr-3 bg-blue-600 rounded-full"></span>
                        <span>{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <span className="flex-shrink-0 inline-block w-2 h-2 mt-2 mr-3 bg-blue-600 rounded-full"></span>
                      <span>No specific requirements listed.</span>
                    </li>
                  )}
                </ul>
              </section>

              {/* What We Offer */}
              <section>
                <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                  <span className="mr-2">What We Offer</span>
                  <span className="flex-grow ml-3 border-t border-gray-200"></span>
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {job.what_we_offer && job.what_we_offer.length > 0 ? (
                    job.what_we_offer.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full"></span>
                        <span>{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <span className="flex-shrink-0 inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full"></span>
                      <span>No benefits information provided.</span>
                    </li>
                  )}
                </ul>
              </section>
            </div>

            {/* Apply Section */}
            <div className="pt-8 mt-10 border-t border-gray-200">
              <div className="p-6 rounded-lg bg-blue-50 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                      Ready to join {job.company.name}?
                    </h2>
                    <p className="text-gray-700">
                      Submit your application today and take the next step in
                      your career.
                    </p>
                  </div>
                  <button
                    onClick={handleApplyNow}
                    disabled={applyDisabled || isSubmitting}
                    className="flex-shrink-0 w-full px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                  >
                    {isSubmitting
                      ? "Applying..."
                      : applyDisabled
                      ? "Applied"
                      : "Apply for this position"}
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
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours === 1) {
    return "1 hour ago";
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }
}

function TruncatedDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100; // Maximum number of characters to show before truncating

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <p className="mt-1 text-gray-600">
      {isExpanded || description.length <= maxLength
        ? description
        : `${description.slice(0, maxLength)}...`}
      {description.length > maxLength && (
        <button
          onClick={toggleExpanded}
          className="ml-2 text-blue-500 hover:underline"
        >
          {isExpanded ? "See Less" : "See More"}
        </button>
      )}
    </p>
  );
}
