// Email service for sending notifications
// This is a basic implementation - can be enhanced with SendGrid, Nodemailer, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // For now, just log the email (in production, integrate with actual email service)
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
      from: options.from || 'noreply@lynklabs.com',
      html: options.html
    });

    // In production, you would integrate with:
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    // - Resend
    // etc.

    // Simulate successful email sending
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

// Helper function for sending simple text emails
export async function sendSimpleEmail(
  to: string,
  subject: string,
  message: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${subject}</h2>
      <p style="color: #666; line-height: 1.6;">${message}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        This email was sent by Lynk Labs. If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html
  });
}

// Email templates for common notifications
export const emailTemplates = {
  orderConfirmation: (orderNumber: string, amount: number) => ({
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">🎉 Order Confirmed!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p>Thank you for choosing Lynk Labs!</p>
      </div>
    `
  }),

  reportReady: (orderNumber: string) => ({
    subject: `Reports Ready - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">📊 Your Reports Are Ready!</h2>
        <p>Your test reports for order <strong>${orderNumber}</strong> are now available.</p>
        <p>Please log in to your account to download them.</p>
      </div>
    `
  })
}; 