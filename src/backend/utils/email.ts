import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Email not sent:", subject);
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

export const sendInvoiceEmail = async (
  clientEmail: string,
  clientName: string,
  amount: number,
  currency: string,
  invoiceNumber: string,
  paymentLink: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">New Invoice from DigitalOrbit</h2>
      <p>Hello ${clientName},</p>
      <p>A new invoice (<strong>#${invoiceNumber}</strong>) has been generated for your account.</p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: #334155;">Amount Due</h3>
        <p style="font-size: 24px; font-weight: bold; color: #0284c7; margin: 10px 0;">
          ${currency} ${amount.toLocaleString()}
        </p>
      </div>
      <a href="${paymentLink}" style="display: inline-block; background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Pay Now
      </a>
      <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
        If you have any questions, please reply to this email.
      </p>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Invoice #${invoiceNumber} from DigitalOrbit`,
    html,
  });
};

export const sendPaymentSuccessEmail = async (
  clientEmail: string,
  clientName: string,
  amount: number,
  currency: string,
  invoiceNumber: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Payment Successful</h2>
      <p>Hello ${clientName},</p>
      <p>Thank you for your payment! We have successfully received <strong>${currency} ${amount.toLocaleString()}</strong> for invoice <strong>#${invoiceNumber}</strong>.</p>
      <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
        You can view your payment history in your Client Portal at any time.
      </p>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Payment Receipt - Invoice #${invoiceNumber}`,
    html,
  });
};

export const sendPaymentFailedEmail = async (
  clientEmail: string,
  clientName: string,
  invoiceNumber: string,
  paymentLink: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Payment Failed</h2>
      <p>Hello ${clientName},</p>
      <p>Unfortunately, your recent payment attempt for invoice <strong>#${invoiceNumber}</strong> failed.</p>
      <p>Please try again using the secure payment link below:</p>
      <a href="${paymentLink}" style="display: inline-block; background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">
        Retry Payment
      </a>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Payment Failed - Action Required (Invoice #${invoiceNumber})`,
    html,
  });
};

export const sendBookingConfirmationEmail = async (
  email: string,
  name: string,
  date: string,
  time: string,
  type: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0284c7; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">Booking Received!</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #334155;">Hello ${name},</p>
        <p style="color: #475569;">We have received your booking request. Our team will review and confirm it shortly.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">Booking Details</h3>
          <p style="margin: 8px 0; color: #475569;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 8px 0; color: #475569;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 8px 0; color: #475569;"><strong>Type:</strong> ${type}</p>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          You will receive another email once your booking is confirmed.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Your Booking Request - DigitalOrbit",
    html,
  });
};

export const sendBookingStatusEmail = async (
  email: string,
  name: string,
  status: "approved" | "rejected" | "rescheduled" | "cancelled",
  date: string,
  time: string,
  type: string,
  meetingLink?: string
) => {
  const colors = {
    approved: "#16a34a",
    rejected: "#dc2626",
    rescheduled: "#d97706",
    cancelled: "#64748b"
  };
  
  const titles = {
    approved: "Booking Confirmed! 🎉",
    rejected: "Booking Update",
    rescheduled: "Booking Rescheduled",
    cancelled: "Booking Cancelled"
  };

  const color = colors[status];
  const title = titles[status];

  let statusMessage = "";
  if (status === "approved") {
    statusMessage = "Great news! Your booking has been confirmed.";
  } else if (status === "rejected") {
    statusMessage = "Unfortunately, we are unable to accommodate your booking request at this time. Our team will reach out to you separately to find an alternative.";
  } else if (status === "rescheduled") {
    statusMessage = "Your booking has been rescheduled to a new time.";
  } else if (status === "cancelled") {
    statusMessage = "Your booking has been cancelled.";
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${color}; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">${title}</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #334155;">Hello ${name},</p>
        <p style="color: #475569;">${statusMessage}</p>
        
        ${status === 'approved' || status === 'rescheduled' ? `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">Meeting Details</h3>
          <p style="margin: 8px 0; color: #475569;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 8px 0; color: #475569;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 8px 0; color: #475569;"><strong>Format:</strong> ${type}</p>
          ${meetingLink ? `<p style="margin: 15px 0 0 0;"><a href="${meetingLink}" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Meeting</a></p>` : ''}
        </div>
        ` : ''}
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          If you need to make changes, please reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - DigitalOrbit`,
    html,
  });
};
