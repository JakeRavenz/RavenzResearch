import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Types
type EducationLevel = 'high_school' | 'associates' | 'bachelors' | 'masters' | 'phd' | 'other';

interface ProfileFormData {
  firstName: string;
  middleName: string;
  surname: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  zipCode: string;
  education: EducationLevel;
}

interface FileUrls {
  resumeUrl: string;
}

interface FormInputProps {
  label: string;
  type?: string;
  name: keyof ProfileFormData;
  value: any;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Select component
interface FormSelectProps {
  label: string;
  name: keyof ProfileFormData;
  value: any;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Phone input component
interface PhoneInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
  required?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="w-full border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      <PhoneInput
        international
        defaultCountry="US"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2"
        inputClassName="w-full border-0 focus:ring-0 focus:outline-none"
      />
    </div>
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

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  currentUrl, 
  onChange, 
  required = false 
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
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

// Success message component with countdown
interface SuccessMessageProps {
  message: string;
  onEdit: () => void;
  redirectUrl: string | null;
  countdown: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onEdit, 
  redirectUrl, 
  countdown 
}) => (
  <div className="text-center p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold text-green-600 mb-4">Profile Updated!</h2>
    <p className="mb-6">{message}</p>
    {redirectUrl && countdown > 0 && (
      <p className="text-sm text-gray-600">
        Redirecting in {countdown} seconds...
      </p>
    )}
  </div>
);

// Education options
const educationOptions = [
  { value: 'high_school', label: 'High School' },
  { value: 'associates', label: 'Associate\'s Degree' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'other', label: 'Other' }
];

// Main component
export default function ProfileForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(5); // 5-second countdown for redirect
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    zipCode: '',
    education: 'bachelors'
  });

  const [fileUrls, setFileUrls] = useState<FileUrls>({
    resumeUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Countdown effect that triggers after success
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (success && redirectUrl && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    } else if (success && redirectUrl && countdown === 0) {
      navigate(redirectUrl);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success, countdown, redirectUrl, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Special handler for phone input
  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value || '',
    }));
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        if (error.message.includes('rows') || error.code === 'PGRST116') {
          console.log('No profile found, user may be new');
          return;
        }
        throw error;
      }
      
      if (data) {
        setFormData({
          firstName: data.first_name || '',
          middleName: data.middle_name || '',
          surname: data.surname || '',
          dateOfBirth: data.date_of_birth || '',
          address: data.address || '',
          phoneNumber: data.phone_number || '',
          zipCode: data.zip_code || '',
          education: data.education || 'bachelors',
        });
        
        setFileUrls({
          resumeUrl: data.resume_url || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Error loading profile data. Please try again later.');
    }
  };

  const handleFileUpload = async (file: File, bucket: string): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: string,
    type: keyof FileUrls
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await handleFileUpload(file, bucket);
      
      if (url) {
        setFileUrls(prev => ({ ...prev, [type]: url }));
      }
    } catch (err: any) {
      console.error(`Error uploading ${type}:`, err);
      setError(`Failed to upload file. Please try again.`);
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
  
      const profileData = {
        id: user.id,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        surname: formData.surname,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        phone_number: formData.phoneNumber,
        zip_code: formData.zipCode,
        education: formData.education,
        updated_at: new Date(),
      };
  
      const { error: submitError } = await supabase
        .from('profiles')
        .upsert(profileData);
  
      if (submitError) throw submitError;
      
      setSuccessMessage("Profile updated successfully!");
      
      // Get redirect URL from query params
      const redirUrl = searchParams.get('redirect');
      if (redirUrl) {
        setRedirectUrl(redirUrl);
      }
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage 
        message={successMessage} 
        onEdit={() => setSuccess(false)} 
        redirectUrl={redirectUrl}
        countdown={countdown}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full">
          <Navbar />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Profile Information</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* All fields in 3-column layout without section separations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput 
                label="First Name" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormInput 
                label="Middle Name" 
                name="middleName" 
                value={formData.middleName} 
                onChange={handleInputChange} 
              />
              
              <FormInput 
                label="Surname" 
                name="surname" 
                value={formData.surname} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormInput 
                label="Date of Birth" 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormInput 
                label="Address" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
                placeholder="Street address"
              />
              
              <FormInput 
                label="Zip Code" 
                name="zipCode" 
                value={formData.zipCode} 
                onChange={handleInputChange} 
                required 
              />
              
              <div>
                <PhoneInputField
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              
              <FormSelect
                label="Education Level"
                name="education"
                value={formData.education}
                options={educationOptions}
                onChange={handleInputChange}
                required
              />
              
              <div>
                <FileUpload
                  label="Resume"
                  accept=".pdf,.doc,.docx"
                  currentUrl={fileUrls.resumeUrl}
                  onChange={(e) => handleFileInputChange(e, 'resumes', 'resumeUrl')}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Accepted formats: PDF, DOC, or DOCX
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto float-right bg-blue-600 text-white py-2 px-8 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center items-center"
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
                'Save Profile'
              )}
            </button>
            <div className="clear-both"></div>
          </div>
        </form>
      </div>
    </div>
  );
}