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
import JobApplicationForm from "./pages/JobApplicationForm";
import Layout from "./components/layout";
import AboutUs from "./pages/AboutUs";
import Faq from "./pages/Faq";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* All other routes wrapped with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id/jobs" element={<CompanyJobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/jobs/apply/:id" element={<JobApplicationForm />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
