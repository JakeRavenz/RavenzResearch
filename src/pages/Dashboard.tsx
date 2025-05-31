import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../components/ui/carousel";
import useAuth from "../hooks/useAuth";
import {
  UserCircle,
  Briefcase,
  CreditCard,
  HelpCircle,
  CheckCircle,
  Clock,
  Settings,
  Edit3,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "../index.css"; // Ensure global styles are loaded

interface JobApplication {
  id: string;
  job_title: string;
  company_name: string;
  status: string;
  applied_at: string;
}

interface Profile {
  first_name?: string;
  surname?: string;
  avatar_url?: string;
  phone_number?: string;
  address?: string;
  // Add other fields you want to check for completion
}

interface FeaturedJob {
  id: string;
  title: string;
  location: string;
  company_name: string;
  logo_url?: string;
}

const PROFILE_FIELDS = [
  { key: "first_name", label: "First Name" },
  { key: "surname", label: "Surname" },
  { key: "phone_number", label: "Phone Number" },
  { key: "address", label: "Address" },
  { key: "email", label: "Email" },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    acceptanceRate: 0,
  });

  useEffect(() => {
    let isMounted = true;
    // Fetch user's job applications and analytics
    const fetchApplicationsAndAnalytics = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          job_title,
          status,
          created_at,
          jobs (
            company:companies (name)
          )
        `)
        .eq("user_id", user ? user.id : null)
        .order("created_at", { ascending: false });

      if (!error && data) {
        if (isMounted) {
          const formattedApplications = data.map((app: any) => ({ // app will have a 'jobs' property
            id: app.id,
            job_title: app.job_title,
            company_name: app.jobs?.company?.name || "Company N/A", // Extract company name
            status: app.status,
            applied_at: app.created_at,
          }));
          setApplications(formattedApplications);
          // --- Analytics Calculation ---
          if (data.length > 0) {
            const total = data.length;
            const accepted = data.filter(
              (a: any) => a.status === "accepted"
            ).length;
            const rejected = data.filter(
              (a: any) => a.status === "rejected"
            ).length;
            const pending = data.filter(
              (a: any) => a.status === "pending"
            ).length;
            const acceptanceRate =
              total > 0 ? Math.round((accepted / total) * 100) : 0;
            setAnalytics({
              total,
              accepted,
              rejected,
              pending,
              acceptanceRate,
            });
          } else {
            setAnalytics({
              total: 0,
              accepted: 0,
              rejected: 0,
              pending: 0,
              acceptanceRate: 0,
            });
          }
        }
      } else if (error) console.error("Error fetching applications:", error);
    };

    const fetchProfileData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, surname, phone_number, address")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          if (isMounted) {
            setProfileData(data);
            let completedFields = 0;
            const missing: string[] = [];
            PROFILE_FIELDS.forEach((field) => {
              if (field.key === "email") {
                if (user.email) completedFields++;
                else missing.push(field.label);
              } else if (
                data[field.key] &&
                String(data[field.key]).trim() !== ""
              ) {
                completedFields++;
              } else {
                missing.push(field.label);
              }
            });
            setProfileCompletion(
              Math.round((completedFields / PROFILE_FIELDS.length) * 100)
            );
            setMissingFields(missing);
          }
        } else if (error) console.error("Error fetching profile data:", error);
      }
    };

    const fetchFeaturedJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, location, company:companies(name, logo_url)")
        .eq("status", "Open")
        .order("created_at", { ascending: false })
        .limit(3); // Fetch 3 jobs for the snippet

      if (!error && data) {
        if (isMounted) {
          const formattedJobs = data.map((job: any) => ({
            id: job.id,
            title: job.title,
            location: job.location,
            company_name: job.company?.name || "N/A",
            logo_url: job.company?.logo_url,
          }));
          setFeaturedJobs(formattedJobs);
        }
      } else if (error) console.error("Error fetching featured jobs:", error);
    };

    if (user) {
      Promise.all([
        fetchApplicationsAndAnalytics(),
        fetchProfileData(),
        fetchFeaturedJobs(),
      ])
        .catch((err) => toast.error("Error loading dashboard data."))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      if (isMounted) setLoading(false); // Not logged in, stop loading
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const displayName =
    profileData?.first_name ||
    user?.user_metadata?.first_name ||
    user?.email?.split("@")?.[0] ||
    "User";

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-lg text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const appStats = analytics;

  return (
    <div className="relative w-full p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
      <div className="relative z-10 max-w-5xl px-4 py-10 mx-auto">
        {/* Profile Snapshot Card */}
        <div className="p-6 mb-10 border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {profileData?.avatar_url ? (
              <img
                src={profileData.avatar_url}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-gray-400 dark:text-gray-500" />
            )}
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome, {displayName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Profile Completion: {profileCompletion}%
                </p>
                <div className="w-full mt-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                {profileCompletion < 100 && (
                  <button
                    onClick={() => navigate("/update-profile")}
                    className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Complete Your Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Show missing fields checklist if profile is incomplete */}
          {profileCompletion < 100 && missingFields.length > 0 && (
            <div className="mt-2 text-xs text-red-500">
              <div className="mb-1 font-semibold text-red-600">
                Missing fields:
              </div>
              <ul className="list-disc list-inside">
                {missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Combined Application Overview & Recent Applications Card */}
        <div className="p-6 mb-10 border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Application Overview
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-8 text-center md:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-indigo-600">
                {appStats.total}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Applied
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500">
                {appStats.pending}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">
                {appStats.accepted}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Accepted
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">
                {appStats.rejected}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rejected
              </p>
            </div>
          </div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Recent Applications
          </h3>
          <div className="mb-6">
            {applications.length === 0 ? (
              <div className="flex flex-col items-center p-6 bg-transparent shadow-none">
                <div className="mb-4 text-gray-500">
                  You haven't applied for any jobs yet.
                </div>
                {/* Jobs Carousel (one at a time, fade in/out) */}
                <MemoizedJobsSuggestionCarousel />
                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  className="px-6 py-2 mt-6 font-semibold text-white transition-colors bg-indigo-600 rounded shadow hover:bg-indigo-700"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <Carousel className="w-full" setApi={setCarouselApi}>
                <CarouselContent>
                  {applications.map((app, i) => (
                    <CarouselItem
                      key={app.id}
                      className={`p-4 transition-all duration-500 ease-in-out ${
                        carouselApi &&
                        typeof carouselApi.selectedScrollSnap === "function" &&
                        carouselApi.selectedScrollSnap() === i
                          ? "animate-fadeInRight"
                          : "opacity-60"
                      }`}
                    >
                      <div className="flex flex-col items-center p-6 text-center shadow-md bg-white/80 dark:bg-slate-800/80 rounded-xl">
                        <div className="mb-2 text-lg font-bold text-indigo-700">
                          {app.job_title}
                        </div>
                        <div className="mb-1 text-gray-600">
                          {app.company_name}
                        </div>
                        <div className="mb-2 text-sm">
                          Applied:{" "}
                          {new Date(app.applied_at).toLocaleDateString()}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            (app as any).status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : (app as any).status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {(app as any).status}
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>
          {appStats.total > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/myJobs")}
                className="px-6 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded shadow hover:bg-indigo-700"
              >
                View All Applications
              </button>
            </div>
          )}
        </div>

        {/* Explore Opportunities Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Explore Opportunities
          </h2>
          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredJobs.map((job) => (
                <Link
                  to={`/jobs/${job.id}`}
                  key={job.id}
                  className="block p-6 transition-shadow border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 hover:shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center mb-3">
                    {job.logo_url ? (
                      <img
                        src={job.logo_url}
                        alt={job.company_name}
                        className="w-10 h-10 mr-3 rounded-md"
                      />
                    ) : (
                      <Briefcase className="w-10 h-10 mr-3 text-gray-400 dark:text-gray-500" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.company_name}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {job.location}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
              <p className="text-gray-500 dark:text-gray-400">
                No featured jobs at the moment. Check back soon!
              </p>
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded shadow hover:bg-indigo-700"
            >
              View All Jobs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Quick Actions Section */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <MemoizedActionCard
                icon={
                  <Edit3 className="w-10 h-10 mb-3 text-indigo-600 dark:text-indigo-400" />
                }
                title="Update Profile"
                description="Keep your details current to attract opportunities."
                buttonText="Go to Profile"
                onClick={() => navigate("/update-profile")}
              />
              <MemoizedActionCard
                icon={
                  <Settings className="w-10 h-10 mb-3 text-indigo-600 dark:text-indigo-400" />
                }
                title="Payment Settings"
                description="Manage your payout methods for smooth transactions."
                buttonText="Set Payments"
                onClick={() => navigate("/update-profile#payment")}
              />
              <MemoizedActionCard
                icon={
                  <Briefcase className="w-10 h-10 mb-3 text-indigo-600 dark:text-indigo-400" />
                }
                title="My Applications"
                description="Track the status of all your job applications."
                buttonText="View Applications"
                onClick={() => navigate("/myJobs")}
              />
              {/* Add more quick actions if needed */}
            </div>
          </div>

          {/* Helpful Resources Section */}
          <div className="lg:col-span-1">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Helpful Resources
            </h2>
            <div className="space-y-6">
              <MemoizedResourceCard
                icon={
                  <HelpCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                }
                title="FAQ"
                description="Find answers to common questions."
                onClick={() => navigate("/faq")}
              />
              <MemoizedResourceCard
                icon={
                  <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                }
                title="Contact Support"
                description="Get help from our support team."
                onClick={() => navigate("/contact")}
              />
              <MemoizedResourceCard
                icon={
                  <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                }
                title="Ravenz Blog"
                description="Career tips and remote work insights."
                onClick={() => navigate("/blog")} // Placeholder, update if you have a blog
                isPlaceholder={true}
              />
            </div>
          </div>
        </div>

        {/* Remote Work Insights / Career Tips Section */}
        <div className="relative mt-6 mb-12 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
          <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
          <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
          <h2 className="mt-6 mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
            Remote Work Insights
          </h2>
          <p className="mb-6 text-base text-center text-gray-600 dark:text-slate-300">
            Daily motivation and career tips to inspire your remote journey.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper components for cards to keep the main component cleaner

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
}) => (
  <div className="flex flex-col p-6 text-center border shadow-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/40 dark:border-slate-700 backdrop-blur-md">
    {icon}
    <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
      {title}
    </h4>
    <p className="flex-grow mb-4 text-sm text-gray-600 dark:text-gray-300">
      {description}
    </p>
    <button
      type="button"
      onClick={onClick}
      className="w-full px-5 py-2 mt-auto font-semibold text-white transition-colors bg-indigo-600 rounded shadow hover:bg-indigo-700"
    >
      {buttonText}
    </button>
  </div>
);

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isPlaceholder?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  icon,
  title,
  description,
  onClick,
  isPlaceholder,
}) => (
  <button
    onClick={onClick}
    disabled={isPlaceholder}
    className={`flex items-center w-full p-4 text-left bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/40 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-md ${
      isPlaceholder ? "opacity-60 cursor-not-allowed" : ""
    }`}
  >
    {icon}
    <div className="ml-4">
      <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </button>
);

// Jobs suggestion carousel for users with no applications (existing component)
const jobsSuggestion = [
  {
    title: "Remote Data Annotator",
    company: "Ravenz Research",
    location: "Remote",
    type: "Part-time",
    description:
      "Help train AI models by labeling data from anywhere in the world.",
  },
  {
    title: "Content Moderator",
    company: "Acme Corp",
    location: "Remote",
    type: "Full-time",
    description:
      "Review and moderate user-generated content for a global platform.",
  },
  {
    title: "Customer Support Agent",
    company: "Globex",
    location: "Remote",
    type: "Flexible",
    description:
      "Assist customers via chat and email. Flexible hours and remote work.",
  },
];

function JobsSuggestionCarousel() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % jobsSuggestion.length);
        setFade(true);
      }, 400); // fade out duration
    }, 3500);
    return () => clearTimeout(timeout);
  }, [index]);

  const job = jobsSuggestion[index];
  return (
    <div className="relative flex items-center justify-center w-full h-48 max-w-md">
      <div
        className={`absolute inset-0 transition-opacity duration-400 bg-indigo-50 dark:bg-gray-700 rounded-xl ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        key={index}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center shadow-md bg-indigo-50 dark:bg-gray-700 rounded-xl">
          <div className="mb-2 text-lg font-bold text-indigo-700 dark:text-indigo-300">
            {job.title}
          </div>
          <div className="mb-1 text-gray-600 dark:text-gray-400">
            {job.company} &bull; {job.location}
          </div>
          <div className="mb-2 text-xs font-semibold text-indigo-500 dark:text-indigo-400">
            {job.type}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {job.description}
          </div>
        </div>
      </div>
    </div>
  );
}

const MemoizedJobsSuggestionCarousel = React.memo(JobsSuggestionCarousel);

// Memoized ActionCard to prevent unnecessary re-renders
const MemoizedActionCard = React.memo(ActionCard);

// Memoized ResourceCard to prevent unnecessary re-renders
const MemoizedResourceCard = React.memo(ResourceCard);

// --- At the bottom of the file, before export default ---

export default Dashboard;
