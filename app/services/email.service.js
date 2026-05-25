import verificationCode from "../templates/emails/verificationCode.js";
import accountApproved from "../templates/emails/accountApproved.js";

const templates = {
  VERIFICATION_CODE: verificationCode,
  ACCOUNT_APPROVED: accountApproved,
};

export async function sendEmail(to, templateName, data = {}) {
  const template = templates[templateName];

  if (!template) {
    throw new Error(`Template desconocido: ${templateName}`);
  }

  const { subject, html } = template(data);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "PoleBid" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al enviar email");
  }
}
