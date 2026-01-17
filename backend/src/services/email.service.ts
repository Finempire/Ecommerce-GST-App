import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

// Email options interface
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

// Get email configuration from environment
const getEmailConfig = (): EmailConfig => {
    return {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
    };
};

// Create transporter
const createTransporter = () => {
    const config = getEmailConfig();

    // Skip if no SMTP credentials configured
    if (!config.auth.user || !config.auth.pass) {
        console.warn('Email service: SMTP credentials not configured. Emails will be logged to console.');
        return null;
    }

    return nodemailer.createTransport(config);
};

/**
 * Send an email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.SMTP_FROM || '"GST Automation Pro" <noreply@gstpro.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    // If no transporter, log the email instead
    if (!transporter) {
        console.log('=== Email (Dev Mode) ===');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Body:', options.text || options.html.substring(0, 200));
        console.log('========================');
        return true;
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.to}`);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
    email: string,
    name: string,
    resetToken: string
): Promise<boolean> => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f5;">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 30px 40px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">GST Automation Pro</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
                                    
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Hi ${name || 'there'},
                                    </p>
                                    
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        We received a request to reset your password. Click the button below to create a new password:
                                    </p>
                                    
                                    <!-- Button -->
                                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 12px;">
                                                <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                        This link will expire in <strong>1 hour</strong>.
                                    </p>
                                    
                                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                                    </p>
                                    
                                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                                    
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0;">
                                        If the button doesn't work, copy and paste this link into your browser:<br>
                                        <a href="${resetUrl}" style="color: #7c3aed;">${resetUrl}</a>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center;">
                                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                        © ${new Date().getFullYear()} GST Automation Pro. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    return sendEmail({
        to: email,
        subject: 'Reset Your Password - GST Automation Pro',
        html,
    });
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f5;">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 30px 40px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to GST Pro! 🎉</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}!</h2>
                                    
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Thank you for joining GST Automation Pro. We're excited to help you streamline your GST compliance!
                                    </p>
                                    
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Here's what you can do:
                                    </p>
                                    
                                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                                        <li>📄 Upload e-commerce sales data from Amazon, Flipkart, Meesho & more</li>
                                        <li>📊 Auto-generate GSTR-1 reports</li>
                                        <li>🔄 Export to Tally with one click</li>
                                        <li>📈 Track your GST analytics</li>
                                    </ul>
                                    
                                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 12px;">
                                                <a href="${dashboardUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                                    Go to Dashboard
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center;">
                                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                        © ${new Date().getFullYear()} GST Automation Pro. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    return sendEmail({
        to: email,
        subject: 'Welcome to GST Automation Pro! 🎉',
        html,
    });
};
