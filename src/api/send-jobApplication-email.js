import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Add extensive logging
  console.log("==== JOB APPLICATION EMAIL HANDLER TRIGGERED ====");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    console.log("Rejected non-POST method:", req.method);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, firstName, surname, jobTitle, jobPosition, jobLink } = req.body;
    
    console.log("Extracted data from request:");
    console.log("- email:", email);
    console.log("- firstName:", firstName);
    console.log("- surname:", surname);
    console.log("- jobTitle:", jobTitle);
    console.log("- jobPosition:", jobPosition);
    console.log("- jobLink:", jobLink);

    // Validate required fields
    if (!email || !email.includes('@')) {
      console.log("Validation failed: Invalid email:", email);
      return res.status(400).json({ success: false, message: 'Invalid or missing email address' });
    }
    if (!firstName || typeof firstName !== 'string') {
      console.log("Validation failed: Invalid firstName:", firstName);
      return res.status(400).json({ success: false, message: 'Invalid or missing first name' });
    }
    if (!surname || typeof surname !== 'string') {
      console.log("Validation failed: Invalid surname:", surname);
      return res.status(400).json({ success: false, message: 'Invalid or missing surname' });
    }
    if (!jobTitle) {
      console.log("Validation failed: Missing jobTitle");
      return res.status(400).json({ success: false, message: 'Missing job title' });
    }

    console.log("All validations passed, preparing email");

    // Create Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Email transporter configured with user:", process.env.EMAIL_USER);

    const mailOptions = {
      from: `"Ravenz Research" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Application Received for ${jobTitle} - Ravenz Research`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #3a86ff; text-align: center;">Congratulations on Your Application!</h2>
        <p>Dear <strong>${firstName} ${surname}</strong>,</p>
        <p>We've successfully received your application for the <strong>${jobTitle}</strong> position at <strong>${jobPosition || 'our company'}</strong>. We are thrilled to have you as a candidate!</p>
        <p>Our team will review your submission shortly, and if your profile is shortlisted, you'll receive further instructions regarding the next steps, including identity verification and onboarding.</p>
        <p>In the meantime, please ensure your contact details remain active and check your email regularly for updates.</p>
        <p>We appreciate your interest in joining our team and look forward to the possibility of working together.</p>
        <p>You can view the job details and track your application status using the link below:</p>
        <p><a href="${jobLink}" style="color: #3a86ff; text-decoration: none;">View Job Details</a></p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br><strong>Ravenz Research</strong><br>www.RavenzResearch.com</p>
      </div>
      `,
      replyTo: process.env.REPLY_EMAIL || process.env.EMAIL_USER
    };

    console.log("Preparing to send email with options:", JSON.stringify({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      replyTo: mailOptions.replyTo
    }, null, 2));

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! MessageID:", info.messageId);
    
    console.log("Returning success response to client");
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
}