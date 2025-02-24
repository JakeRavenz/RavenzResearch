import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string; // Ensure this column exists in your jobs table
  // Add any additional fields if needed
}

export default function CompanyJobs() {
  // The company id is obtained from the URL parameters.
  const { id } = useParams<{ id: string }>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('name')
          .eq('id', id)
          .single();
        if (companyError) {
          console.error('Error fetching company:', companyError);
        } else {
          setCompanyName(companyData?.name || '');
        }

        // Fetch jobs for this company
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', id)
          .order('title');
        if (jobError) {
          console.error('Error fetching jobs for company:', jobError);
        } else {
          setJobs(jobData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Jobs for {companyName ? companyName : `Company ${id}`}
      </h1>
      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs found for this company.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="mt-1 text-gray-600">{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
