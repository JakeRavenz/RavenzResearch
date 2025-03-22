import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Types
interface CompanyFormData {
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
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onEdit }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold text-green-600 mb-4">Company Information Updated!</h2>
    <p className="mb-6">{message}</p>
    <button 
      onClick={onEdit} 
      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
    >
      Edit Company
    </button>
  </div>
);

// Main component
export default function CompanyForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    logo_url: '',
    website: '',
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCompany = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to view or edit your company');
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - this is fine for new users
        throw error;
      }
      
      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          logo_url: data.logo_url || '',
          website: data.website || '',
        });
      }
    } catch (err: any) {
      console.error('Error fetching company:', err);
      setError(err.message);
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
        name: formData.name,
        description: formData.description,
        logo_url: formData.logo_url,
        website: formData.website,
        user_id: user.id,
        updated_at: new Date(),
      };
  
      const { error: submitError } = await supabase
        .from('companies')
        .upsert(companyData, { onConflict: 'user_id' });
  
      if (submitError) throw submitError;
  
      setSuccessMessage("Company information updated successfully!");
      setSuccess(true);
  
      // Redirect to the homepage after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect after 2 seconds
    } catch (err: any) {
      console.error('Company update error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (success) {
    return <SuccessMessage message={successMessage} onEdit={() => setSuccess(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Company Information</h2>

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

      <div className="mt-8">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            'Save Company'
          )}
        </button>
      </div>
    </form>
  );
}