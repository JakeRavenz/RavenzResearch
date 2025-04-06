import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Types
interface JobFormData {
  title: string;
  description: string;
  salary_min: number | '';
  salary_max: number | '';
  location: string;
  type: string;
  remote_level: string;
  status: string;
  requirements: string[];
  what_we_offer: string[];
  company_id: string | null;
}

// Main component
export default function PostJobForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    salary_min: '',
    salary_max: '',
    location: '',
    type: 'Full-time',
    remote_level: 'On-site',
    status: 'Open',
    requirements: [],
    what_we_offer: [],
    company_id: null
  });

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  const fetchUserCompanies = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to post a job');
      }

      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCompanies(data);
        // Set first company as default
        setFormData(prev => ({...prev, company_id: data[0].id}));
      } else {
        // No companies found
        setError('Please create a company profile before posting a job');
      }
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    // Allow empty strings or convert to number
    const numValue = value === '' ? '' : parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        what_we_offer: [...prev.what_we_offer, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      what_we_offer: prev.what_we_offer.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Authentication required');
  
      if (!formData.company_id) {
        throw new Error('Please select a company for this job posting');
      }

      // Validate salary
      if (formData.salary_min !== '' && formData.salary_max !== '' && 
          Number(formData.salary_min) > Number(formData.salary_max)) {
        throw new Error('Minimum salary cannot be greater than maximum salary');
      }
  
      const jobData = {
        title: formData.title,
        description: formData.description,
        salary_min: formData.salary_min === '' ? null : formData.salary_min,
        salary_max: formData.salary_max === '' ? null : formData.salary_max,
        location: formData.location,
        type: formData.type,
        remote_level: formData.remote_level,
        status: formData.status,
        requirements: formData.requirements,
        what_we_offer: formData.what_we_offer,
        company_id: formData.company_id,
      };
  
      const { error: submitError } = await supabase
        .from('jobs')
        .insert(jobData);
  
      if (submitError) throw submitError;
      
      setSuccess(true);
      
      // Redirect if needed
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (err: any) {
      console.error('Job posting error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Job Posted Successfully!</h2>
        <p className="mb-6">Your job listing has been published and is now visible to candidates.</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setSuccess(false)} 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Post Another Job
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
           Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {companies.length === 0 ? (
        <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
          <p className="font-medium">You need to create a company profile before posting a job.</p>
          <button 
            onClick={() => navigate('/create-company')}
            className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-md transition-colors"
          >
            Create Company Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Company *
            </label>
            <select
              name="company_id"
              value={formData.company_id || ''}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Job Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={8}
              placeholder="Describe the role, responsibilities, and ideal candidate..."
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Salary
            </label>
            <input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleNumberChange}
              placeholder="e.g. 50000"
              min="0"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Salary
            </label>
            <input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleNumberChange}
              placeholder="e.g. 70000"
              min="0"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="e.g. New York, NY"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Remote Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remote Level *
            </label>
            <select
              name="remote_level"
              value={formData.remote_level}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="On-site">On-site</option>
              <option value="hybrid">Hybrid</option>
              <option value="fully-remote">Remote</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Requirements */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a job requirement"
                className="flex-grow px-3 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="mt-2">
              {formData.requirements.length > 0 ? (
                <ul className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <li key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No requirements added yet</p>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What We Offer (Benefits)
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit or perk"
                className="flex-grow px-3 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="mt-2">
              {formData.what_we_offer.length > 0 ? (
                <ul className="space-y-2">
                  {formData.what_we_offer.map((benefit, index) => (
                    <li key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                      <span>{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No benefits added yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button 
          type="submit" 
          disabled={loading || companies.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting Job...
            </>
          ) : (
            'Post Job'
          )}
        </button>
      </div>
    </form>
  );
}