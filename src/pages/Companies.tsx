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
    <div className="p-6 bg-white shadow-sm animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200"></div>
        <div className="flex-1">
          <div className="w-3/4 h-5 mb-2 bg-gray-200"></div>
          <div className="w-full h-4 mb-1 bg-gray-200"></div>
          <div className="w-2/3 h-4 bg-gray-200"></div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-24 h-4 bg-gray-200"></div>
        <div className="w-32 h-4 bg-gray-200"></div>
      </div>
      <div className="mt-6">
        <div className="w-24 h-8 bg-gray-200"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-gray-600">Discover companies hiring remote talent</p>
        </div>
        
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CompanySkeletonLoader />
          <CompanySkeletonLoader />
          <CompanySkeletonLoader />
          <CompanySkeletonLoader />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="py-16 text-center bg-white shadow-sm">
          <Building2 className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mt-6 text-xl font-medium text-gray-900">No companies found</h3>
          <p className="max-w-md mx-auto mt-2 text-gray-600">
            {searchTerm 
              ? "No results match your search criteria. Try adjusting your search terms."
              : "Be the first to list your company on our platform."}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 mt-4 text-white transition-colors bg-indigo-600 hover:bg-indigo-700"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">{filteredCompanies.length} companies found</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredCompanies.map((company) => (
              <div 
                key={company.id} 
                className="p-6 transition-all bg-white border border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md group"
              >
                <div className="flex items-start space-x-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      className="object-cover w-16 h-16 p-1 bg-white border border-gray-100"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 border border-gray-200">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">{company.name}</h2>
                     <TruncatedDescription description={company.description} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-gray-600">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center transition-colors hover:text-indigo-600"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Company Website
                    </a>
                  )}
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {company._count.jobs} {company._count.jobs === 1 ? 'job' : 'jobs'} available
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => navigate(`/companies/${company.id}`)}
                    className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
                  >
                    Company Profile
                  </button>
                  <button
                    onClick={() => navigate(`/companies/${company.id}/jobs`)}
                    className="flex items-center px-4 py-2 text-indigo-600 transition-colors bg-white border border-indigo-600 hover:bg-indigo-50"
                  >
                    View Jobs
                    <ArrowRight className="w-4 h-4 ml-2 transition-opacity opacity-0 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCompanies.length > 10 && (
            <div className="flex justify-center mt-8">
              <button className="px-6 py-2 text-white transition-colors bg-indigo-600 hover:bg-indigo-700">
                Load More Companies
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TruncatedDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150; // Maximum number of characters to show before truncating

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <p className="mt-1 text-gray-600">
      {isExpanded || description.length <= maxLength
        ? description
        : `${description.slice(0, maxLength)}...`}
      {description.length > maxLength && (
        <button
          onClick={toggleExpanded}
          className="ml-2 text-blue-500 hover:underline"
        >
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
    </p>
  );
}