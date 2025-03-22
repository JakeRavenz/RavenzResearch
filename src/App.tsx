import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/langingPage'; 
import Companies from './pages/Companies';
import CompanyJobs from './pages/CompanyJobs';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Jobs from './pages/Jobs';
import JobDetails from './pages/jobDetails';
import JobApplicationForm from './pages/JobApplicationForm';
import Layout from './components/layout';
import CompanyForm from './pages/createCompanies';
import PostJobForm from './pages/postJobs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path = "/company-bio" element= {<CompanyForm />} />
        <Route path = "/post-job" element={<PostJobForm />} />

        {/* All other routes wrapped with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id/jobs" element={<CompanyJobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs/apply" element={<JobApplicationForm />} />
          <Route path="/jobs" element={<Jobs />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
