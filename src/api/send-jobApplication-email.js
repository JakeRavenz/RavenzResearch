import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, firstName, surname, jobTitle, jobPosition, jobLink } = req.body;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid or missing email address' });
    }
    if (!firstName || typeof firstName !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing first name' });
    }
    if (!surname || typeof surname !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing surname' });
    }

    // Safe fallbacks
    const safeJobTitle = jobTitle || 'a position';
    const safeJobPosition = jobPosition || 'our company';
    const safeJobLink = jobLink || 'https://www.ravenzresearch.com';

    // Configure transporter using EMAIL_USER for both auth and from
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NO_REPLY_EMAIL,
        pass: process.env.NO_REPLY_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"Ravenz Research Careers" <${process.env.NO_REPLY_EMAIL}>`,
      to: email,
      subject: `Application Received for ${safeJobTitle} – Ravenz Research`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 6px;">
          <div style="text-align: center; background-color: #3a86ff; color: white; padding: 16px; border-radius: 4px 4px 0 0;">
            <h2>Application Received</h2>
          </div>

          <div style="padding: 20px; font-size: 16px; color: #333;">
            <p>Dear <strong>${firstName} ${surname}</strong>,</p>

            <p>Thank you for applying for the <strong>${safeJobTitle}</strong> role at <strong>Ravenz Research</strong>. We have successfully received your application for the position of <strong>${safeJobPosition}</strong>.</p>

            <p>Our recruitment team is currently reviewing your application, and we will be in touch with the next steps shortly.</p>

            <p>In the meantime, if you’d like to learn more about the role, or our company, please visit the button below:</p> 
            <div style="text-align: center; margin: 20px 0;">
              <a href="${safeJobLink}" style="background-color: #3a86ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Job Details</a>
            </div>

            <p>If you experience any issues with the button above, copy and paste the URL below into your browser</p>
            <p><a href="${safeJobLink}" style="color: #3a86ff;" target="_blank">${safeJobLink}</a></p>

            <p>We appreciate your interest in joining our team!</p>
          </div>

          <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; font-size: 14px; color: #777;">
            <p>Best regards,<br><strong>Ravenz Research Careers Team</strong><br>www.ravenzresearch.com</p>
          </div>
        </div>
      `,
      // The replyTo field is commented out because it is not currently required. Uncomment and set it if needed in the future.
      // replyTo: process.env.EMAIL_USER,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending application confirmation email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
}
