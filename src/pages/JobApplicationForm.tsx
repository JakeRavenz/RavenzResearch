import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: any;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

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
      className="w-full px-3 py-2 border rounded-md"
    />
  </div>
);

export default function ProfileForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
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
  

  const [fileUrls, setFileUrls] = useState({
    avatarUrl: '',
    resumeUrl: '',
    idUploadUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in');

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
      setError(err.message);
    }
  };

  const handleFileUpload = async (file: File, bucket: string, type: string) => {
    try {
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
    } catch (err: any) {
      throw new Error(`${type} upload failed: ${err.message}`);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: string,
    type: string
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = await handleFileUpload(file, bucket, type);
      if (url) {
        setFileUrls((prev) => ({ ...prev, [`${type}Url`]: url }));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');
  
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
  
      const { error: submitError } = await supabase.from('profiles').upsert({
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
        verification_status: 'pending', // Add this field to track verification status
      });
  
      if (submitError) throw submitError;
      
      // Send verification email using the Vercel API route
      // This uses a relative URL that works in both development and production
      const emailResponse = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName: formData.firstName,
          surname: formData.surname
        }),
      });
      
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.warn('Verification email could not be sent:', errorData);
        setSuccessMessage("Profile updated successfully! However, we could not send the verification email. Please contact support.");
      } else {
        setSuccessMessage("Profile updated successfully! Please check your email to schedule your verification call.");
      }
      
      setSuccess(true);
      
      // After a successful update, check for a redirect query param
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Profile Updated!</h2>
        <p className="mb-4">{successMessage || "Your profile has been updated successfully."}</p>
        <button onClick={() => setSuccess(false)} className="bg-green-600 text-white px-6 py-2 rounded-md">
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Form</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
      )}

      {/* Grid with three columns */}
      <div className="grid grid-cols-3 gap-4">
        <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        <FormInput label="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} required />
        <FormInput label="Surname" name="surname" value={formData.surname} onChange={handleInputChange} required />
        <FormInput label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
        <FormInput label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
        <FormInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
        <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
        <FormInput label="Work Experience" name="workExperience" value={formData.workExperience} onChange={handleInputChange} required />
        <FormInput label="Headline" name="headline" value={formData.headline} onChange={handleInputChange} required />
        <FormInput label="Bio" name="bio" value={formData.bio} onChange={handleInputChange} required />
        <FormInput label="Skills" name="skills" value={formData.skills} onChange={handleInputChange} required placeholder="Separate skills with commas" />
        
        {/* ID Type as Select spanning all three columns */}
        <div className="mb-4 col-span-3">
          <label className="block text-sm font-medium text-gray-700">ID Type *</label>
          <select 
            name="idType" 
            value={formData.idType} 
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select ID Type</option>
            <option value="passport">Passport</option>
            <option value="driverLicense">Driver License</option>
            <option value="nationalId">National ID</option>
          </select>
        </div>

        <FormInput label="ID Number" name="idNumber" value={formData.idNumber} onChange={handleInputChange} required />

        {/* File uploads, each occupying one cell */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Resume *</label>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={(e) => handleFileInputChange(e, 'resumes', 'resume')}
            required 
            className="w-full" 
          />
          {fileUrls.resumeUrl && <p className="mt-1 text-sm text-gray-500">Current: {fileUrls.resumeUrl}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Avatar *</label>
          <input 
            type="file" 
            accept="image/png,image/jpeg" 
            onChange={(e) => handleFileInputChange(e, 'avatars', 'avatar')}
            required 
            className="w-full" 
          />
          {fileUrls.avatarUrl && <p className="mt-1 text-sm text-gray-500">Current: {fileUrls.avatarUrl}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload ID *</label>
          <input 
            type="file" 
            accept="image/png,image/jpeg,application/pdf" 
            onChange={(e) => handleFileInputChange(e, 'ids', 'idUpload')}
            required 
            className="w-full" 
          />
          {fileUrls.idUploadUrl && <p className="mt-1 text-sm text-gray-500">Current: {fileUrls.idUploadUrl}</p>}
        </div>

        {/* Checkbox occupies one cell spanning three columns */}
        <div className="mb-4 col-span-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="availableForHire"
              checked={formData.availableForHire}
              onChange={handleInputChange}
              required
              className="mr-2"
            />
            <span className="text-sm">Available for Hire *</span>
          </label>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Updating...' : 'Submit'}
      </button>
    </form>
  );
}