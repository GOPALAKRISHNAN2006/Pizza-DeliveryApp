import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Creates Nodemailer Transporter with connection timeouts
 */
const createTransporter = () => {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn("⚠️ Warning: EMAIL_USER and EMAIL_PASSWORD are not fully configured in .env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    },
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 5000
  });
};

/**
 * Core sendEmail helper
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.log(`[DEV MODE / NO EMAIL CREDENTIALS] Email to: ${to} | Subject: "${subject}"`);
      return { success: true, simulated: true };
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Oasis Pizza 🍕" <${EMAIL_USER}>`,
      to,
      subject,
      text: text || "Oasis Pizza Notification",
      html
    });

    console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email sending failed for ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Email Verification link to newly registered user
 */
export const sendVerificationEmail = async (user, verificationToken) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
  const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #e11d48, #f97316); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">🍕 Oasis Pizza</h1>
        <p style="color: #fed7aa; margin: 8px 0 0 0; font-size: 15px;">Fresh, Hot, & Custom Made For You</p>
      </div>
      <div style="padding: 32px 24px; color: #334155;">
        <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Welcome aboard, ${user.name}!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
          Thank you for joining Oasis Pizza. To begin crafting your ultimate dream pizza and tracking orders in real-time, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}" style="background: linear-gradient(135deg, #e11d48, #f97316); color: #ffffff; padding: 14px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);">
            Verify My Email
          </a>
        </div>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
          This verification link will expire in <strong>15 minutes</strong>. If you did not create an account on Oasis Pizza, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Oasis Pizza Inc. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Verify Your Oasis Pizza Account 🍕",
    html
  });
};

/**
 * Send Password Reset link to user
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #e11d48, #f97316); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">🍕 Oasis Pizza</h1>
        <p style="color: #fed7aa; margin: 8px 0 0 0; font-size: 15px;">Password Reset Request</p>
      </div>
      <div style="padding: 32px 24px; color: #334155;">
        <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Hello ${user.name},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
          We received a request to reset your password for your Oasis Pizza account. Click the button below to set a new password:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #e11d48, #f97316); color: #ffffff; padding: 14px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
          This link will expire in <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email; your password will remain unchanged.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Oasis Pizza Inc. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Reset Your Oasis Pizza Password 🔐",
    html
  });
};

/**
 * Send Low Stock Alert Email to Admin
 */
export const sendLowStockAlertEmail = async (lowStockItems) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAIl;
  if (!adminEmail) {
    console.warn("No ADMIN_EMAIL specified in environment variables for low stock alert");
    return;
  }

  const itemsHtml = lowStockItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-weight: 600; color: #0f172a;">${item.name}</td>
        <td style="padding: 12px 16px; text-transform: capitalize; color: #64748b;">${item.category}</td>
        <td style="padding: 12px 16px; font-weight: 700; color: ${item.quantity === 0 ? '#ef4444' : '#f59e0b'};">${item.quantity} units</td>
        <td style="padding: 12px 16px; color: #64748b;">${item.lowStockThreshold} units</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #b91c1c, #ea580c); padding: 28px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">⚠️ Low Stock Alert</h1>
        <p style="color: #fecdd3; margin: 6px 0 0 0; font-size: 14px;">Oasis Pizza Inventory Notification System</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; color: #334155; margin-top: 0;">
          The automated inventory monitor has detected <strong>${lowStockItems.length}</strong> ingredient(s) at or below their minimum stock threshold:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
              <th style="padding: 10px 16px; color: #475569;">Item</th>
              <th style="padding: 10px 16px; color: #475569;">Category</th>
              <th style="padding: 10px 16px; color: #475569;">Current Stock</th>
              <th style="padding: 10px 16px; color: #475569;">Threshold</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p style="font-size: 14px; color: #475569;">
          Please restock these items in the Admin Dashboard to prevent order fulfillment delays.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          Generated automatically by Oasis Pizza Cron Job • ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🚨 [ALERT] Low Stock Detected for ${lowStockItems.length} Pizza Ingredient(s)`,
    html
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockAlertEmail
};
