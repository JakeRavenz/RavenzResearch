// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/langingPage'; 
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Jobs from './pages/Jobs';
import JobDetails from './pages/jobDetails';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Render LandingPage at the root path */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/companies" element={<Companies />} />
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
