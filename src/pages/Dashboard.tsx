import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../components/ui/carousel";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

interface JobApplication {
  id: string;
  job_title: string;
  company_name: string;
  status: string;
  applied_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Fetch user's job applications
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("id, job_title, company_name, status, applied_at")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });
      if (!error && data) setApplications(data);
    };
    fetchApplications();
  }, [user, navigate]);

  const firstName =
    user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {firstName}!</h1>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Job Applications</h2>
        {applications.length === 0 ? (
          <div className="p-6 text-gray-500 bg-white rounded-lg shadow">
            You haven't applied for any jobs yet.
          </div>
        ) : (
          <Carousel
            className="w-full max-w-2xl mx-auto"
            setApi={setCarouselApi}
          >
            <CarouselContent>
              {applications.map((app) => (
                <CarouselItem key={app.id} className="p-4">
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                    <div className="text-lg font-bold text-indigo-700 mb-2">
                      {app.job_title}
                    </div>
                    <div className="text-gray-600 mb-1">{app.company_name}</div>
                    <div className="text-sm mb-2">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Profile Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-indigo-600 font-bold text-lg mb-2">
              Personal Info
            </div>
            <div className="text-gray-700 mb-1">
              {user?.user_metadata?.first_name || "-"}{" "}
              {user?.user_metadata?.last_name || ""}
            </div>
            <div className="text-gray-500 text-sm">
              {user?.user_metadata?.gender || "-"}
            </div>
          </div>
          {/* Contact Info Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-indigo-600 font-bold text-lg mb-2">
              Contact Info
            </div>
            <div className="text-gray-700 mb-1">{user?.email}</div>
            <div className="text-gray-500 text-sm">
              {user?.user_metadata?.phoneNumber || "No phone on file"}
            </div>
          </div>
          {/* Account Status Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-indigo-600 font-bold text-lg mb-2">
              Account Status
            </div>
            <div className="text-gray-700 mb-1">
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"}
            </div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${
                user?.confirmed_at
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {user?.confirmed_at ? "Verified" : "Pending Verification"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
