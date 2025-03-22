import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Types
type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface ProfileFormData {
  firstName: string;
  middleName: string;
  surname: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  zipCode: string;
  workExperience: string;
  headline: string;
  bio: string;
  skills: string;
  availableForHire: boolean;
  idType: string;
  idNumber: string;
  verification_status: VerificationStatus;
}

interface FileUrls {
  avatarUrl: string;
  resumeUrl: string;
  idUploadUrl: string;
}

interface FormInputProps {
  label: string;
  type?: string;
  name: keyof ProfileFormData;
  value: any;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
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
    <h2 className="text-2xl font-bold text-green-600 mb-4">Profile Updated!</h2>
    <p className="mb-6">{message}</p>
    <button 
      onClick={onEdit} 
      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
    >
      Edit Profile
    </button>
  </div>
);

// Main component
export default function ProfileForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    zipCode: '',
    workExperience: '',
    headline: '',
    bio: '',
    skills: '',
    availableForHire: true,
    idType: '',
    idNumber: '',
    verification_status: 'pending'
  });

  const [fileUrls, setFileUrls] = useState<FileUrls>({
    avatarUrl: '',
    resumeUrl: '',
    idUploadUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to view or edit your profile');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          firstName: data.first_name || '',
          middleName: data.middle_name || '',
          surname: data.surname || '',
          dateOfBirth: data.date_of_birth || '',
          address: data.address || '',
          phoneNumber: data.phone_number || '',
          zipCode: data.zip_code || '',
          workExperience: data.work_experience || '',
          headline: data.headline || '',
          bio: data.bio || '',
          skills: data.skills ? data.skills.join(', ') : '',
          availableForHire: data.available_for_hire ?? true,
          idType: data.id_type || '',
          idNumber: data.id_number || '',
          verification_status: data.verification_status || 'pending',
        });
        
        setFileUrls({
          avatarUrl: data.avatar_url || '',
          resumeUrl: data.resume_url || '',
          idUploadUrl: data.id_upload || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
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
      setError(`Failed to upload ${type}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string, firstName: string, surname: string) => {
    try {
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, surname }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Verification email failed:', errorData);
        return { success: false, error: errorData };
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Email sending error:', err);
      return { success: false, error: err.message };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');
  
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
  
      const profileData = {
        id: user.id,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        surname: formData.surname,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        phone_number: formData.phoneNumber,
        zip_code: formData.zipCode,
        work_experience: formData.workExperience,
        headline: formData.headline,
        bio: formData.bio,
        skills: skillsArray,
        available_for_hire: formData.availableForHire,
        id_type: formData.idType,
        id_number: formData.idNumber,
        avatar_url: fileUrls.avatarUrl,
        resume_url: fileUrls.resumeUrl,
        id_upload: fileUrls.idUploadUrl,
        verification_status: 'pending' as const,
        updated_at: new Date(),
      };
  
      const { error: submitError } = await supabase
        .from('profiles')
        .upsert(profileData);
  
      if (submitError) throw submitError;
      
      // Send verification email
      const emailResult = await sendVerificationEmail(
        user.email as string, 
        formData.firstName, 
        formData.surname
      );
      
      if (emailResult.success) {
        setSuccessMessage("Profile updated successfully! Please check your email to schedule your verification call.");
      } else {
        setSuccessMessage("Profile updated successfully! However, we could not send the verification email. Please contact support.");
      }
      
      setSuccess(true);
      
      // Redirect if needed
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
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
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personal Information */}
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
        
        {/* Contact Information */}
        <FormInput 
          label="Date of Birth" 
          type="date" 
          name="dateOfBirth" 
          value={formData.dateOfBirth} 
          onChange={handleInputChange} 
          required 
        />
        <FormInput 
          label="Phone Number" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleInputChange} 
          required 
        />
        <FormInput 
          label="Zip Code" 
          name="zipCode" 
          value={formData.zipCode} 
          onChange={handleInputChange} 
          required 
        />
        
        {/* Address - full width */}
        <div className="col-span-1 md:col-span-3">
          <FormInput 
            label="Address" 
            name="address" 
            value={formData.address} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        {/* Professional Details */}
        <div className="col-span-1 md:col-span-3">
          <FormInput 
            label="Headline" 
            name="headline" 
            value={formData.headline} 
            onChange={handleInputChange} 
            required 
            placeholder="Software Engineer | React Developer | UX Specialist"
          />
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <FormInput 
            label="Work Experience (years)" 
            type="number" 
            name="workExperience" 
            value={formData.workExperience} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <FormInput 
            label="Skills" 
            name="skills" 
            value={formData.skills} 
            onChange={handleInputChange} 
            required 
            placeholder="React, TypeScript, Node.js, AWS (separate skills with commas)" 
          />
        </div>
        
        {/* ID verification */}
        <div className="col-span-1 md:col-span-3 mt-4 mb-2">
          <h3 className="text-lg font-medium">Identity Verification</h3>
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">ID Type *</label>
            <select 
              name="idType" 
              value={formData.idType} 
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="driverLicense">Driver's License</option>
              <option value="nationalId">National ID</option>
            </select>
          </div>
        </div>

        <FormInput 
          label="ID Number" 
          name="idNumber" 
          value={formData.idNumber} 
          onChange={handleInputChange} 
          required 
        />
        
        {/* File uploads */}
        <div className="col-span-1 md:col-span-3 mt-4 mb-2">
          <h3 className="text-lg font-medium">Document Uploads</h3>
        </div>
        
        <FileUpload
          label="Resume"
          accept=".pdf,.doc,.docx"
          currentUrl={fileUrls.resumeUrl}
          onChange={(e) => handleFileInputChange(e, 'resumes', 'resumeUrl')}
          required
        />
        
        <FileUpload
          label="Profile Photo"
          accept="image/png,image/jpeg"
          currentUrl={fileUrls.avatarUrl}
          onChange={(e) => handleFileInputChange(e, 'avatars', 'avatarUrl')}
          required
        />
        
        <FileUpload
          label="ID Document"
          accept="image/png,image/jpeg,application/pdf"
          currentUrl={fileUrls.idUploadUrl}
          onChange={(e) => handleFileInputChange(e, 'ids', 'idUploadUrl')}
          required
        />

        {/* Availability checkbox */}
        <div className="col-span-1 md:col-span-3 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="availableForHire"
              checked={formData.availableForHire}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Available for Hire</span>
          </label>
        </div>
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
            'Save Profile'
          )}
        </button>
      </div>
    </form>
  );
}