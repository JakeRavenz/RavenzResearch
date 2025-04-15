# Ravenz Research Platform

Ravenz Research is a platform designed to connect talented professionals with remote job opportunities. It provides features for job seekers to apply for jobs, manage applications, and receive notifications. Employers can post job listings and manage their company profiles. The platform also includes serverless functions for email notifications and uses modern web technologies for a seamless experience.

## Features

### For Job Seekers

- **Browse Jobs**: Explore a wide range of remote job opportunities.
- **Apply for Jobs**: Submit applications directly through the platform.
- **Track Applications**: Manage and track the status of job applications.
- **Email Notifications**: Receive email updates for successful applications and verification.

### For Employers

- **Post Jobs**: Create and manage job listings with detailed descriptions.
- **Company Profiles**: Manage company information, including logos and descriptions.

### General Features

- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Serverless Functions**: Email notifications are handled using serverless functions with Nodemailer and Zoho SMTP.
- **Secure Authentication**: User authentication and authorization powered by Supabase.
- **Dynamic Content**: Real-time updates for job listings and applications.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Supabase (PostgreSQL)
- **Email Service**: Nodemailer with Zoho SMTP
- **State Management**: React Hooks and Context API
- **Build Tools**: Vite, Webpack
- **Styling**: Tailwind CSS

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/ravenz-research.git
    cd ravenz-research
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables: Create a `.env` file in the root directory and add the following:
    ```bash
    REACT_APP_SUPABASE_URL=your-supabase-url
    REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
    EMAIL_USER=your-zoho-email@example.com
    EMAIL_PASSWORD=your-zoho-email-password
    REPLY_EMAIL=reply-to-email@example.com
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

## Folder Structure

- `src/`: Contains the source code for the platform.
- `pages/`: React components for different pages (e.g., `Home.tsx`, `MyJobs.tsx`, `CompanyJobs.tsx`).
- `components/`: Reusable React components (e.g., `Navbar.tsx`, `Footer.tsx`).
- `api/`: Serverless functions for email notifications.
- `assets/`: Static assets like images and logos.
- `styles/`: Global and component-specific styles.

## API Endpoints

### `POST /api/send-verification-email`

Sends a verification email to users upon registration.

- **Request Body**:  
  ```json
  {
     "email": "user@example.com"
  }
  ```
- **Response**:  
  - `200 OK`: Email sent successfully.  
  - `500 Internal Server Error`: Failed to send email.

### `POST /api/send-jobApplication-email`

Sends an email to users upon successful job application.

- **Request Body**:  
  ```json
  {
     "email": "user@example.com",
     "jobTitle": "Frontend Developer"
  }
  ```
- **Response**:  
  - `200 OK`: Email sent successfully.  
  - `500 Internal Server Error`: Failed to send email.

## Usage

- **Job Application**: Users can browse job listings, view details, and apply for jobs.
- **Email Notifications**: Users receive emails for successful applications and verification.
- **Job Posting**: Employers can create and manage job listings.

## Deployment

The platform can be deployed on any hosting service that supports Node.js and serverless functions, such as Vercel or AWS Lambda.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For any questions or inquiries, please contact [info@ravenzresearch.com](mailto:info@ravenzresearch.com).

