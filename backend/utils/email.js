import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, error: error.message };
  }
};

// Send notification email to admin
export const sendAdminNotification = async (adminEmail, subject, content) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #002b4d;">${subject}</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          ${content}
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          This is an automated notification from Find My Scholarship.
        </p>
      </div>
    `;

    return await sendEmail(adminEmail, subject, html);
  } catch (error) {
    console.error("Error sending admin notification: ", error);
    return { success: false, error: error.message };
  }
};
