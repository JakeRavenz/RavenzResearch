import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryDropdown } from "react-country-region-selector";

import { PayPalIcon, AirTMIcon, PayoneerIcon } from "../assets/icons";

// Types
type EducationLevel =
  | "high_school"
  | "associates"
  | "bachelors"
  | "masters"
  | "phd"
  | "other";

interface ProfileFormData {
  firstName: string;
  middleName: string;
  surname: string;
  dateOfBirth: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  education: EducationLevel;
  gender: string;
  payment_method: string;
  paymentAccountDetails: string;
  idType?: string;
  idNumber?: string;
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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  min?: string;
  max?: string;
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
  min,
  max,
}) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
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
    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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

// Radio Group Input component
interface RadioOption {
  value: string;
  label: string | JSX.Element;
}

interface RadioGroupInputProps {
  label: string;
  name: keyof ProfileFormData;
  value: string;
  options: RadioOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const RadioGroupInput: React.FC<RadioGroupInputProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            required={required}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700"
          />
          <span className="flex items-center gap-1 ml-2 text-sm text-gray-700 dark:text-gray-300">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

// Country select component
interface CountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <CountryDropdown
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
    />
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
}) => {
  const [error, setError] = useState<string | null>(null);

  const checkPhoneValidity = (value: string | undefined) => {
    if (value && value.replace(/\D/g, "").length < 7) {
      setError("Phone number must be at least 7 digits.");
    } else {
      setError(null);
    }
    onChange(value);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="w-full text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700 dark:text-white">
        <PhoneInput
          international
          defaultCountry="US"
          value={value}
          onChange={checkPhoneValidity}
          required={required}
          className="w-full px-3 py-2 bg-transparent border-0 focus:ring-0 focus:outline-none" // Ensure PhoneInput itself is transparent
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// File upload component
interface FileUploadProps {
  label: string;
  accept: string;
  currentUrl: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  currentUrl,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
      {""} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      accept={accept}
      onChange={onChange}
      required={required && !currentUrl}
      className="w-full py-1 text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
    />
    {currentUrl && (
      <div className="max-w-full mt-1 text-sm text-gray-500 truncate dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Current file:
        </span>{" "}
        {currentUrl.split("/").pop()}
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

// Success Message component implementation
const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onEdit,
  redirectUrl,
  countdown,
}) => {
  useEffect(() => {
    if (countdown === 0 && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [countdown, redirectUrl]);

  return (
    <div className="p-6 text-center bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-green-600 dark:text-green-400">
        ✓ Success!
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">{message}</p>
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-blue-200 rounded-full dark:border-blue-700 animate-spin border-t-transparent dark:border-t-transparent"></div>
        <span className="text-gray-500 dark:text-gray-400">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </span>
      </div>
    </div>
  );
};

// Education options
const educationOptions = [
  { value: "high_school", label: "High School" },
  { value: "associates", label: "Associate's Degree" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD / Doctorate" },
  { value: "other", label: "Other" },
];
//gender options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non binary", label: "Non-Binary" },
  { value: "other", label: "Other" },
  { value: "prefer not to say", label: "Prefer Not to Say" },
];

// Main component
export default function ProfileForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5); // 5-second countdown for redirect
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [paymentAccountError, setPaymentAccountError] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    middleName: "",
    surname: "",
    dateOfBirth: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    country: "US",
    phoneNumber: "",
    education: "bachelors",
    gender: "prefer not to say",
    payment_method: "add payment method",
    paymentAccountDetails: "",
    idType: "",
    idNumber: "",
  });

  const [fileUrls, setFileUrls] = useState<FileUrls>({
    resumeUrl: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []); // Calculate min and max dates
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 60;
  const minDate = `${minYear}-01-01`;
  const maxDate = `2007-12-31`; // Set max date to the end of 2007

  // Countdown effect that triggers after success
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (success && redirectUrl && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (success && redirectUrl && countdown === 0) {
      navigate(redirectUrl);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success, countdown, redirectUrl, navigate]);

  const validatePaymentAccountDetails = (method: string, value: string) => {
    if (!method || !value) return null; // Only validate if both are provided
    switch (method) {
      case "paypal":
      case "payoneer":
        // Simple email regex
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) {
          return "Please enter a valid email address.";
        }
        break;
      case "airtm":
        // Airtm allows username or email, so accept either
        if (
          !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value) && // not email
          !/^[a-zA-Z0-9_.-]{3,}$/.test(value) // not a valid username
        ) {
          return "Enter a valid Airtm email or username (at least 3 characters).";
        }
        break;
      default:
        if (value.length < 3) {
          return "Please enter valid account details.";
        }
    }
    return null;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "paymentAccountDetails") {
      const error = validatePaymentAccountDetails(
        formData.payment_method,
        value
      );
      setPaymentAccountError(error);
    }
    if (name === "payment_method") {
      // Reset error and details when payment method changes
      setPaymentAccountError(null);
      setFormData((prev) => ({
        ...prev,
        paymentAccountDetails: "",
      }));
    }
  };

  // Special handler for phone input
  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value || "",
    }));
  };

  // Special handler for country select
  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };
  // Special handler for gender select
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        console.error("No active session found");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .match({ id: session.user.id })
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          console.log("No profile found for this user, creating a new one");
          return;
        }
        throw error;
      }

      if (data) {
        setFormData({
          firstName: data.first_name || "",
          middleName: data.middle_name || "",
          surname: data.surname || "",
          dateOfBirth: data.date_of_birth || "",
          address: data.address || "",
          city: data.city || "",
          region: data.region || "",
          postalCode: data.postal_code || "",
          country: data.country || "US",
          phoneNumber: data.phone_number || "",
          education: data.education || "bachelors",
          gender: data.gender || "prefer not to say",
          payment_method: data.payment_method || "",
          paymentAccountDetails: data.payment_account_details || "",
          idType: data.id_type || "",
          idNumber: data.id_number || "",
        });

        setFileUrls({
          resumeUrl: data.resume_url || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Error loading profile data. Please try again later.");
    }
  };

  const handleFileUpload = async (
    file: File,
    bucket: string
  ): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

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
        setFileUrls((prev) => ({ ...prev, [type]: url }));
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
    setError("");
    // const digitsOnly = formData.phoneNumber.replace(/\D/g, "");
    // if (digitsOnly.length < 7) {
    //   setError("Phone number must be at least 7 digits.");
    //   setLoading(false);
    //   return; // Stop submission if validation fails
    // }
    // Validate payment account details before submitting
    if (formData.payment_method && formData.paymentAccountDetails) {
      const error = validatePaymentAccountDetails(
        formData.payment_method,
        formData.paymentAccountDetails
      );
      setPaymentAccountError(error);
      if (error) {
        setLoading(false);
        return;
      }
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      // Update profile data
      const profileData = {
        id: user.id,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        surname: formData.surname,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        region: formData.region,
        postal_code: formData.postalCode,
        country: formData.country,
        phone_number: formData.phoneNumber,
        education: formData.education,
        gender: formData.gender,
        payment_method: formData.payment_method,
        payment_account_details: formData.paymentAccountDetails,
        id_type: formData.idType,
        id_number: formData.idNumber,
        updated_at: new Date(),
        resume_url: fileUrls.resumeUrl,
      };

      const { error: submitError } = await supabase
        .from("profiles")
        .upsert(profileData); // Specify the primary key column

      if (submitError) {
        // Provide more detailed error logging
        console.error("Supabase upsert error:", submitError);
        // Check for specific error details if available
        if (submitError.details)
          console.error("Error details:", submitError.details);
        if (submitError.hint) console.error("Error hint:", submitError.hint);
        throw new Error(`Database error: ${submitError.message}`); // Throw a more specific error
      }

      // Send verification email (non-blocking)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const email = session?.user?.email;
        if (email) {
          await fetch("/api/send-verification-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              firstName: formData.firstName,
              surname: formData.surname,
            }),
          });
        }
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      // Set success state and redirect info
      setSuccessMessage(
        "Profile updated successfully! Redirecting to your profile..."
      );
      setRedirectUrl(`/profile`);
      setSuccess(true);
      setCountdown(3); // Reset countdown to 3 seconds
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodOptions = [
    {
      value: "paypal",
      label: (
        <>
          <PayPalIcon />
          PayPal
        </>
      ),
    },
    {
      value: "airtm",
      label: (
        <>
          <AirTMIcon />
          Airtm
        </>
      ),
    },
    {
      value: "payoneer",
      label: (
        <>
          <PayoneerIcon />
          Payoneer
        </>
      ),
    },
    { value: "other", label: "Other" },
  ];

  const getPaymentAccountDetailsLabel = (method: string): string => {
    switch (method) {
      case "paypal":
        return "PayPal Email";
      case "payoneer":
        return "Payoneer Email";
      case "airtm":
        return "Airtm Email/Username";
      default:
        return "Payment Account Details";
    }
  };

  const getPaymentAccountDetailsPlaceholder = (method: string): string => {
    switch (method) {
      case "paypal":
        return "Enter your PayPal email address";
      case "payoneer":
        return "Enter your Payoneer email address";
      case "airtm":
        return "Enter your Airtm email or username";
      default:
        return "Enter account details (e.g., bank info, other ID)";
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto bg-slate-100 dark:bg-gray-900">
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          {success ? (
            <div className="max-w-3xl mx-auto">
              <SuccessMessage
                message={successMessage}
                onEdit={() => setSuccess(false)}
                redirectUrl={redirectUrl}
                countdown={countdown}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <h1 className="pb-2 mb-8 text-3xl font-bold text-center text-gray-800 dark:text-white">
                Profile Information
              </h1>

              {error &&
                !success && ( // Only show main error if not in success state
                  <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-300 rounded-md dark:text-red-300 dark:border-red-600 dark:bg-red-900_bg_opacity_25">
                    {error}
                  </div>
                )}

              <div className="space-y-8">
                {/* Personal Information */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 hover:shadow-2xl">
                  <h2 className="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
                    Personal Information
                  </h2>
                  {error && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md dark:bg-red-900_bg_opacity_30 dark:text-red-300">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormInput
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="John"
                    />

                    <FormInput
                      label="Middle Name"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Optional"
                    />

                    <FormInput
                      label="Surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      required
                      placeholder="Doe"
                    />
                    <FormSelect
                      label="Select Gender"
                      name="gender"
                      value={formData.gender}
                      options={genderOptions}
                      onChange={handleGenderChange}
                      required
                    />

                    <FormInput
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      min={minDate} // Pass the calculated min date
                      max={maxDate} // Pass the max date (end of 2007)
                    />

                    <div>
                      <PhoneInputField
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        // required
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
                  </div>
                </div>
                {/* Address Information */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 hover:shadow-2xl">
                  <h2 className="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
                    Address Information
                  </h2>
                  {/* Error display specific to this card can be added here if needed */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormInput
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Street address, apartment, unit, etc."
                    />

                    <FormInput
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="City name"
                    />

                    <FormInput
                      label="State/Province/Region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                      placeholder="State, province, or region"
                    />

                    <FormInput
                      label="Postal/Zip Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="Postal or zip code"
                    />

                    <CountrySelect
                      label="Country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      required
                    />
                  </div>
                </div>
                {/* Payment Information Card */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 hover:shadow-2xl">
                  <h2 className="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
                    Payment Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <RadioGroupInput
                      label="Preferred Payment Method"
                      name="payment_method"
                      value={formData.payment_method}
                      options={paymentMethodOptions}
                      onChange={handleInputChange}
                    />
                    {formData.payment_method &&
                      formData.payment_method !== "add payment method" && (
                        <div>
                          <FormInput
                            label={getPaymentAccountDetailsLabel(
                              formData.payment_method
                            )}
                            name="paymentAccountDetails"
                            value={formData.paymentAccountDetails}
                            onChange={handleInputChange}
                            placeholder={getPaymentAccountDetailsPlaceholder(
                              formData.payment_method
                            )}
                          />
                          {paymentAccountError && (
                            <p className="mt-1 text-sm text-red-500">
                              {paymentAccountError}
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 hover:shadow-2xl">
                  <h2 className="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
                    Documents
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <FileUpload
                      label="Resume"
                      accept=".pdf,.doc,.docx"
                      // required={!fileUrls.resumeUrl}
                      currentUrl={fileUrls.resumeUrl}
                      onChange={(e) =>
                        handleFileInputChange(e, "resumes", "resumeUrl")
                      }
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {fileUrls.resumeUrl
                        ? "(Uploading a new file will replace the current one)."
                        : " Accepted formats: PDF, DOC, or DOCX."}
                    </p>
                  </div>
                </div>

                {/* Government ID & Compliance Section */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 hover:shadow-2xl">
                  <h2 className="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b dark:text-white dark:border-gray-700">
                    Government ID & Compliance
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Government ID Section */}
                    <div>
                      <FormInput
                        label="Government ID Type"
                        name="idType"
                        value={formData.idType || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Passport, National ID, Driver's License"
                      />
                      <FormInput
                        label="Government ID Number"
                        name="idNumber"
                        value={formData.idNumber || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your ID number"
                      />
                      {/* Approval status display (optional, for now just show submitted if filled) */}
                      {formData.idType && formData.idNumber && (
                        <div className="inline-block px-3 py-1 mt-2 text-xs text-green-700 bg-green-100 rounded-full">
                          Submitted
                        </div>
                      )}
                    </div>
                    {/* Compliance Check Section */}
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Compliance Check
                      </h3>
                      <button
                        type="button"
                        disabled={!(formData.idType && formData.idNumber)}
                        className={`w-full px-4 py-2 rounded-md shadow font-semibold transition-colors ${
                          formData.idType && formData.idNumber
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Start Compliance Check
                      </button>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Submit and get your government ID approved to enable
                        compliance check.
                      </p>
                    </div>
                    {/* Take Exam Section */}
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Take Exam
                      </h3>
                      <button
                        type="button"
                        disabled={!(formData.idType && formData.idNumber)}
                        className={`w-full px-4 py-2 rounded-md shadow font-semibold transition-colors ${
                          formData.idType && formData.idNumber
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Start Exam
                      </button>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Complete compliance check to unlock the exam.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center float-right w-full px-8 py-2 text-white transition-colors bg-blue-600 rounded-md select-none md:w-auto hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 text-white animate-spin"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
                <div className="clear-both"></div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
