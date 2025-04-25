import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/langingPage";
import Companies from "./pages/Companies";
import CompanyJobs from "./pages/CompanyJobs";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/jobDetails";
import UpdateProfile from "./pages/UpdateProfile";
import Layout from "./components/layout";
import AboutUs from "./pages/AboutUs";
import CompanyForm from "./pages/createCompanies";
import Faq from "./pages/Faq";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import PostJobForm from "./pages/postJobs";
import Policies from "./pages/Policies";
import TermsOfService from "./pages/TermsOfService";
import MyJobs from "./pages/myJobs";
import WhatsAppWidget from "./components/WhatsAppWidget";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/company-bio" element={<CompanyForm />} />
        <Route path="/post-job" element={<PostJobForm />} />
        <Route path="/jobs/apply" element={<UpdateProfile />} />

        {/* All other routes wrapped with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id/jobs" element={<CompanyJobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/myJobs" element={<MyJobs />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Route>
      </Routes>
      <WhatsAppWidget />
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
