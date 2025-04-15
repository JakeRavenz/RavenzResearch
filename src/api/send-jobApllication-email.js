import nodemailer from "nodemailer";

export default async function handler(req, res) {
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
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, firstName, jobTitle, jobLink, jobPosition } = req.body;

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

    const mailOptions = {
      from: `"Ravenz Research" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Application Successful: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #3a86ff; text-align: center;">Congratulations on Your Application!</h2>
          <p>Dear <strong>${firstName}</strong>,</p>
          <p>Thank you for applying to <strong>${jobTitle}</strong> for the position of <strong>${jobPosition}</strong> at Ravenz Research. We are thrilled to have you as a candidate!</p>
          <p>You can view the job details and track your application status using the link below:</p>
           <p><a href="${jobLink}" style="color: #3a86ff; text-decoration: none;">View Job Details</a></p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Ravenz Research Team</p>
        </div>
      `,
      replyTo: process.env.REPLY_EMAIL || process.env.EMAIL_USER,
    };

    await transporter.sendMail(mailOptions);
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
