import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/Logger';
import { config } from '../config/app.config';

const logger = new Logger('EmailService');

export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private siteUrl: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }

    // Validate API key format
    if (!apiKey.startsWith('re_')) {
      throw new Error('RESEND_API_KEY appears to be invalid. It should start with "re_"');
    }

    if (apiKey.length < 20) {
      throw new Error('RESEND_API_KEY appears to be too short. Please check your API key.');
    }

    this.resend = new Resend(apiKey);
    
    // For development/testing, use Resend's test domain: onboarding@resend.dev
    // For production, use your verified domain
    const emailFrom = process.env.EMAIL_FROM;
    
    if (!emailFrom || emailFrom.includes('gmail.com') || emailFrom.includes('yahoo.com') || emailFrom.includes('outlook.com')) {
      logger.warn('EMAIL_FROM is not set or using personal email. Using Resend test domain: onboarding@resend.dev');
      this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    } else {
      this.fromEmail = emailFrom;
    }
    
    this.siteUrl = config.frontendUrl;
    
    logger.info(`EmailService initialized with from: ${this.fromEmail}`);
    logger.info(`API Key validated (starts with: ${apiKey.substring(0, 8)}...)`);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${this.siteUrl}/auth/reset-password?token=${resetToken}`;
      
      // Load email template - go up to project root
      const templatePath = path.join(__dirname, '../../../../email-templates/password-reset.html');
      
      // Check if template exists
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Email template not found at: ${templatePath}`);
      }
      
      let htmlContent = fs.readFileSync(templatePath, 'utf-8');
      
      // Replace placeholders
      htmlContent = htmlContent
        .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, resetUrl)
        .replace(/\{\{\s*\.Email\s*\}\}/g, email)
        .replace(/\{\{\s*\.SiteURL\s*\}\}/g, this.siteUrl);

      logger.info(`Attempting to send password reset email to ${email} from ${this.fromEmail}`);

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Reset Your Password - Cybercrime Platform',
        html: htmlContent,
      });

      if (error) {
        logger.error('Resend API error:', error);
        logger.error(`Failed to send to: ${email}`);
        
        // Check if it's a domain/recipient issue
        if (error.message && error.message.includes('recipient')) {
          throw new Error(`The recipient email address (${email}) may be invalid or the domain is blocking emails from Resend. Error: ${error.message || JSON.stringify(error)}`);
        }
        
        throw new Error(`Failed to send email via Resend: ${error.message || JSON.stringify(error)}`);
      }

      logger.info(`Password reset email sent successfully to ${email}`, { emailId: data?.id });
    } catch (error) {
      logger.error('Error in sendPasswordResetEmail:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while sending password reset email');
    }
  }

  /**
   * Send password change confirmation email
   */
  async sendPasswordChangedEmail(email: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Password Changed Successfully - Cybercrime Platform',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Password Changed</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #1f2937; font-size: 28px;">Password Changed Successfully</h1>
              <p>Your password has been changed successfully. If you did not make this change, please contact our support team immediately.</p>
              <p style="margin-top: 30px;">
                <a href="${this.siteUrl}/auth/login" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Login to Your Account</a>
              </p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
                <p>This email was sent to <strong>${email}</strong></p>
                <p>&copy; 2026 Cybercrime Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        logger.error('Failed to send password changed email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      logger.info(`Password changed confirmation email sent to ${email}`, { emailId: data?.id });
    } catch (error) {
      logger.error('Error sending password changed email:', error);
      throw error;
    }
  }
}
