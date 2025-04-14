/*
  # Remote Work Platform Schema

  1. New Tables
    - companies
      - Basic company information
      - Logo, name, description, etc.
    - jobs
      - Job listings with details
      - Title, description, salary range, etc.
    - applications
      - Job applications linking users to jobs
      - Status tracking and communication
    - profiles
      - Extended user profile information
      - Skills, experience, resume URL, etc.

  2. Security
    - RLS policies for all tables
    - Secure access patterns for different user roles
*/

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  logo_url text,
  website text,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  salary_min integer,
  salary_max integer,
  location text,
  type text CHECK (type IN ('full-time', 'part-time', 'contract', 'freelance')),
  remote_level text CHECK (remote_level IN ('fully-remote', 'hybrid', 'on-site')),
  company_id uuid REFERENCES companies(id) NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft'))
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  full_name text,
  headline text,
  bio text,
  avatar_url text,
  resume_url text,
  skills text[],
  available_for_hire boolean DEFAULT true
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  job_id uuid REFERENCES jobs(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  user_email text REFERENCES auth.users(email) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  cover_letter text,
  UNIQUE(job_id, user_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Companies policies
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Companies are insertable by authenticated users"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies are updatable by owners"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Jobs are insertable by company owners"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE id = company_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Jobs are updatable by company owners"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE id = company_id AND user_id = auth.uid()
    )
  );

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.id = applications.job_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.id = applications.job_id AND c.user_id = auth.uid()
    )
  );