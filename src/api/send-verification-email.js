import nodemailer from 'nodemailer';

export default async function handler(req, res) {  console.log('*** verification HANDLER TRIGGERED ***', new Date().toISOString());
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, firstName, surname } = req.body;
    
    // Validate input fields
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid or missing email address' });
    }
    if (!firstName || typeof firstName !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing first name' });
    }
    if (!surname || typeof surname !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing surname' });
    }

    // Create Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    const mailOptions = {
      from: `"Verification Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Ravenz Research – Next Steps for Verification',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <!-- Email content as in your original code -->
          <div style="text-align: center; padding: 15px 0; background-color: #3a86ff; border-radius: 4px;">
            <h2 style="color: white; margin: 0;">Welcome Aboard!</h2>
          </div>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px; line-height: 1.5; color: #333;">Dear <strong>${firstName || ''} ${surname || ''}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for registering with Ravenz Research! We are excited to have you on board.</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">As part of our security and compliance process, all applicants must complete an ID verification before proceeding.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3a86ff; margin: 20px 0; border-radius: 3px;">
              <p style="font-size: 16px; font-weight: bold; color: #333; margin-top: 0;">What Happens Next?</p>
            </div>
            
            <ul style="font-size: 16px; line-height: 1.5; color: #333; background-color: #f8f9fa; padding: 15px 15px 15px 40px; border-radius: 3px;">
              <li style="margin-bottom: 10px;">You will receive a separate email shortly with your ID verification appointment details, including date, time, and instructions.</li>
              <li style="margin-bottom: 10px;">Please ensure a stable internet connection and a valid government-issued ID ready for the verification process.</li>
            </ul>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">If you have any questions in the meantime, feel free to respond to this mail with them.</p>
            
            <p style="font-size: 16px; line-height: 1.5; color: #333;">We look forward to verifying your details and welcoming you fully to Ravenz Research!</p>
          </div>
          
          <div style="padding-top: 20px; border-top: 1px solid #e1e1e1; color: #666; font-size: 14px;">
            <p>Best regards,<br><strong>Ravenz Research</strong><br>www.RavenzResearch.com</p>
          </div>
        </div>
      `,
      replyTo: process.env.REPLY_EMAIL ? process.env.REPLY_EMAIL : process.env.EMAIL_USER
    };
    
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
}

