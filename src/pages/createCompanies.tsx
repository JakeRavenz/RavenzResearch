import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Types
interface CompanyFormData {
  id?: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
}

interface FormInputProps {
  label: string;
  type?: string;
  name: keyof CompanyFormData;
  value: any;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Components
const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && '*'}
    </label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange as any}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
);

// File upload component
interface FileUploadProps {
  label: string;
  accept: string;
  currentUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, currentUrl, onChange, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && '*'}
    </label>
    <input
      type="file"
      accept={accept}
      onChange={onChange}
      required={required && !currentUrl}
      className="w-full py-1"
    />
    {currentUrl && (
      <div className="mt-1 text-sm text-gray-500 truncate max-w-full">
        <span className="font-medium">Current file:</span> {currentUrl.split('/').pop()}
      </div>
    )}
  </div>
);

// Success message component
interface SuccessMessageProps {
  message: string;
  onEdit: () => void;
  onCreateNew: () => void;
  onViewAll: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onEdit, onCreateNew, onViewAll }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold text-green-600 mb-4">Company Information Updated!</h2>
    <p className="mb-6">{message}</p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button 
        onClick={onEdit} 
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Continue Editing
      </button>
      <button 
        onClick={onCreateNew} 
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Create New Company
      </button>
      <button 
        onClick={onViewAll} 
        className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        View All Companies
      </button>
    </div>
  </div>
);

// Company selector component
interface CompanyListProps {
  companies: { id: string; name: string }[];
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, onSelect, onCreateNew }) => (
  <div className="mb-8 p-6 bg-white rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">Your Companies</h2>
    
    {companies.length > 0 ? (
      <div className="space-y-3">
        {companies.map(company => (
          <div key={company.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
            <span className="font-medium">{company.name}</span>
            <button
              onClick={() => onSelect(company.id)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 mb-4">You haven't created any companies yet.</p>
    )}
    
    <button 
      onClick={onCreateNew}
      className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
    >
      Create New Company
    </button>
  </div>
);

// Main component
export default function CompanyForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [showCompanyList, setShowCompanyList] = useState(!companyId);
  
  const [formData, setFormData] = useState<CompanyFormData>({
    id: undefined,
    name: '',
    description: '',
    logo_url: '',
    website: '',
  });

  useEffect(() => {
    fetchUserCompanies();
  }, []);
  
  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
    }
  }, [companyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchUserCompanies = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to view or edit your companies');
      }

      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCompanies(data || []);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError(err.message);
    }
  };

  const fetchCompany = async (id: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to view or edit your company');
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          id: data.id,
          name: data.name || '',
          description: data.description || '',
          logo_url: data.logo_url || '',
          website: data.website || '',
        });
        setShowCompanyList(false);
      }
    } catch (err: any) {
      console.error('Error fetching company:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error: uploadError } = await supabase
      .storage
      .from('company-logos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage
      .from('company-logos')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await handleFileUpload(file);
      
      if (url) {
        setFormData(prev => ({ ...prev, logo_url: url }));
      }
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      setError(`Failed to upload logo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');
  
      const companyData = {
        ...(formData.id && { id: formData.id }), // Include ID only when editing existing
        name: formData.name,
        description: formData.description,
        logo_url: formData.logo_url,
        website: formData.website,
        user_id: user.id,
        updated_at: new Date(),
      };
  
      // If no ID is present, we're creating a new company
      if (!formData.id) {
        companyData['created_at'] = new Date();
      }
  
      const { data, error: submitError } = await supabase
        .from('companies')
        .upsert(companyData, { onConflict: formData.id ? 'id' : undefined })
        .select('id')
        .single();
  
      if (submitError) throw submitError;
  
      // Update companies list
      await fetchUserCompanies();
      
      // Update form data to include the ID (important for new companies)
      if (data) {
        setFormData(prev => ({ ...prev, id: data.id }));
      }
  
      setSuccessMessage(formData.id ? "Company updated successfully!" : "New company created successfully!");
      setSuccess(true);
    } catch (err: any) {
      console.error('Company update error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    setFormData({
      id: undefined,
      name: '',
      description: '',
      logo_url: '',
      website: '',
    });
    setSuccess(false);
    setShowCompanyList(false);
  };

  const handleViewAll = () => {
    navigate('/companies');
  };

  const handleSelectCompany = (id: string) => {
    navigate(`?id=${id}`);
  };

  if (showCompanyList) {
    return (
      <div className="max-w-3xl mx-auto">
        <CompanyList 
          companies={companies} 
          onSelect={handleSelectCompany} 
          onCreateNew={handleCreateNew} 
        />
      </div>
    );
  }

  if (success) {
    return (
      <SuccessMessage 
        message={successMessage} 
        onEdit={() => setSuccess(false)} 
        onCreateNew={handleCreateNew}
        onViewAll={handleViewAll}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{formData.id ? 'Edit Company' : 'Create New Company'}</h2>
        <button
          type="button"
          onClick={() => setShowCompanyList(true)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to companies
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Company Information */}
        <FormInput 
          label="Company Name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          required 
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Company Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={6}
            placeholder="Tell us about your company, business, mission and vision..."
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <FormInput 
          label="Website" 
          name="website" 
          value={formData.website} 
          onChange={handleInputChange} 
          placeholder="https://example.com"
        />
        
        <FileUpload
          label="Company Logo"
          accept="image/png,image/jpeg,image/svg+xml"
          currentUrl={formData.logo_url}
          onChange={handleLogoChange}
          required
        />
        
        {formData.logo_url && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Preview
            </label>
            <div className="w-40 h-40 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
              <img 
                src={formData.logo_url} 
                alt="Company logo" 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {formData.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            formData.id ? 'Update Company' : 'Create Company'
          )}
        </button>
        
        {formData.id && (
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Another Company
          </button>
        )}
      </div>
    </form>
  );
}