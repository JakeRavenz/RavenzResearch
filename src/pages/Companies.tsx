import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, Globe, Users } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  _count: {
    jobs: number;
  };
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select(`
            *,
            _count: jobs(count)
          `)
          .order('name');

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return (
    // Outer container: full width with responsive padding.
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <p className="mt-2 text-gray-600">Discover companies hiring remote talent</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No companies found</h3>
          <p className="mt-2 text-gray-600">Be the first to list your company</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                  <p className="mt-1 text-gray-600 line-clamp-2">{company.description}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-indigo-600"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {company._count.jobs} open positions
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate(`/companies/${company.id}/jobs`)}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  View Jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
