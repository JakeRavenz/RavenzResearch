// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

console.log('Email credentials loaded:', {
    user: process.env.EMAIL_USER || 'not defined',
    pass: process.env.EMAIL_PASSWORD ? '[password is set]' : 'not defined'
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create Zoho SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587, // Try using port 587 (TLS) instead of 465 (SSL)
    secure: false, // Set to false for TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    },
  debug: true
});

app.post('/api/send-verification-email', async (req, res) => {
    try {
      const { email, firstName, surname } = req.body;
      
      const mailOptions = {
        from: `"Verification Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Schedule Your Verification Call',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
            <div style="text-align: center; padding: 15px 0; background-color: #3a86ff; border-radius: 4px;">
              <h2 style="color: white; margin: 0;">Profile Verification</h2>
            </div>
            
            <div style="padding: 20px 0;">
              <p style="font-size: 16px; line-height: 1.5; color: #333;">Hello <strong>${firstName || ''} ${surname || ''}</strong>,</p>
              
              <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for updating your profile. To complete the verification process, we need to schedule a brief video call.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3a86ff; margin: 20px 0; border-radius: 3px;">
                <p style="font-size: 16px; font-weight: bold; color: #333; margin-top: 0;">Please reply to this email with your preferred date and time for the verification call.</p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.5; color: #333;">Include a few options that work for you in the following format:</p>
              
              <ul style="font-size: 16px; line-height: 1.5; color: #333; background-color: #f8f9fa; padding: 15px 15px 15px 40px; border-radius: 3px;">
                <li style="margin-bottom: 10px;">Option 1: [Date] at [Time] (include your timezone)</li>
                <li style="margin-bottom: 10px;">Option 2: [Date] at [Time] (include your timezone)</li>
                <li style="margin-bottom: 10px;">Option 3: [Date] at [Time] (include your timezone)</li>
              </ul>
              
              <p style="font-size: 16px; line-height: 1.5; color: #333;">We'll confirm one of your suggested times or propose alternatives if needed.</p>
              
              <p style="font-size: 16px; line-height: 1.5; color: #333;">If you have any questions, please don't hesitate to contact our support team.</p>
            </div>
            
            <div style="padding-top: 20px; border-top: 1px solid #e1e1e1; color: #666; font-size: 14px;">
              <p>Best regards,<br><strong>Verification Team</strong></p>
            </div>
          </div>
        `,
        replyTo: process.env.REPLY_EMAIL || process.env.EMAIL_USER
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});