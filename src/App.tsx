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
          <Route path="/jobs" element={<Jobs />} />nd
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
