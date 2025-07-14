const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      // For development, you can use a service like Gmail or Ethereal Email
      // For production, use a service like SendGrid, AWS SES, or Mailgun
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      }
    });
  }

  async sendEmailVerificationOTP(email, otp, name) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@bulkbuy.com',
      to: email,
      subject: 'BulkBuy - Email Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 0; 
              padding: 0; 
              background-color: #f4f4f4; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              padding: 20px; 
              border-radius: 10px; 
              box-shadow: 0 0 10px rgba(0,0,0,0.1); 
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .otp-box { 
              background: #f8f9fa; 
              border: 2px dashed #007bff; 
              padding: 20px; 
              text-align: center; 
              margin: 20px 0; 
              border-radius: 8px; 
            }
            .otp-code { 
              font-size: 32px; 
              font-weight: bold; 
              color: #007bff; 
              letter-spacing: 5px; 
              margin: 10px 0; 
            }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              text-align: center; 
              color: #6c757d; 
              font-size: 14px; 
              border-radius: 0 0 10px 10px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 BulkBuy</h1>
              <h2>Email Verification</h2>
            </div>
            
            <div style="padding: 20px;">
              <p>Hello <strong>${name}</strong>,</p>
              
              <p>Thank you for registering with BulkBuy! To complete your registration and verify your email address, please use the following OTP code:</p>
              
              <div class="otp-box">
                <p>Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>This code will expire in 10 minutes</small></p>
              </div>
              
              <p>If you didn't create an account with BulkBuy, please ignore this email.</p>
              
              <p>Best regards,<br>The BulkBuy Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2025 BulkBuy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email verification OTP sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email verification OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetOTP(email, otp, name) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@bulkbuy.com',
      to: email,
      subject: 'BulkBuy - Password Reset',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 0; 
              padding: 0; 
              background-color: #f4f4f4; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              padding: 20px; 
              border-radius: 10px; 
              box-shadow: 0 0 10px rgba(0,0,0,0.1); 
            }
            .header { 
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .otp-box { 
              background: #f8f9fa; 
              border: 2px dashed #dc3545; 
              padding: 20px; 
              text-align: center; 
              margin: 20px 0; 
              border-radius: 8px; 
            }
            .otp-code { 
              font-size: 32px; 
              font-weight: bold; 
              color: #dc3545; 
              letter-spacing: 5px; 
              margin: 10px 0; 
            }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              text-align: center; 
              color: #6c757d; 
              font-size: 14px; 
              border-radius: 0 0 10px 10px; 
            }
            .warning { 
              background: #fff3cd; 
              border: 1px solid #ffeaa7; 
              color: #856404; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 15px 0; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 BulkBuy</h1>
              <h2>Password Reset Request</h2>
            </div>
            
            <div style="padding: 20px;">
              <p>Hello <strong>${name}</strong>,</p>
              
              <p>We received a request to reset your password. Use the following OTP code to proceed with your password reset:</p>
              
              <div class="otp-box">
                <p>Your reset code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>This code will expire in 10 minutes</small></p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and consider changing your password as a precaution.
              </div>
              
              <p>Best regards,<br>The BulkBuy Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2025 BulkBuy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset OTP sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset OTP:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
