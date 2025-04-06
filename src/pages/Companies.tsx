import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, Globe, Users, Search, Briefcase, ArrowRight } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
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

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CompanySkeletonLoader = () => (
    <div className="bg-white shadow-sm p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="h-16 w-16 bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 w-full mb-1"></div>
          <div className="h-4 bg-gray-200 w-2/3"></div>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-4 bg-gray-200 w-24"></div>
        <div className="h-4 bg-gray-200 w-32"></div>
      </div>
      <div className="mt-6">
        <div className="h-8 bg-gray-200 w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-gray-600">Discover companies hiring remote talent</p>
        </div>
        
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanySkeletonLoader />
          <CompanySkeletonLoader />
          <CompanySkeletonLoader />
          <CompanySkeletonLoader />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-16 bg-white shadow-sm">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="mt-6 text-xl font-medium text-gray-900">No companies found</h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            {searchTerm 
              ? "No results match your search criteria. Try adjusting your search terms."
              : "Be the first to list your company on our platform."}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">{filteredCompanies.length} companies found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCompanies.map((company) => (
              <div 
                key={company.id} 
                className="bg-white shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all p-6 group"
              >
                <div className="flex items-start space-x-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      className="h-16 w-16 object-cover bg-white p-1 border border-gray-100"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{company.name}</h2>
                    <p className="mt-2 text-gray-600 line-clamp-2">{company.description}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-indigo-600 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Company Website
                    </a>
                  )}
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {company._count.jobs} {company._count.jobs === 1 ? 'job' : 'jobs'} available
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    
                    className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium"
                  >
                    Company Profile
                  </button>
                  <button
                    onClick={() => navigate(`/companies/${company.id}/jobs`)}
                    className="bg-white text-indigo-600 px-4 py-2 border border-indigo-600 hover:bg-indigo-50 transition-colors flex items-center"
                  >
                    View Jobs
                    <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCompanies.length > 10 && (
            <div className="mt-8 flex justify-center">
              <button className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                Load More Companies
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}