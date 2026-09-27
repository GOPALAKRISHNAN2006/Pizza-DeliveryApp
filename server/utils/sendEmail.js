import { sendEmail } from "../services/emailService.js";

const sendEmailCompat = async (to, subject, html) => {
  return sendEmail({ to, subject, html });
};

export default sendEmailCompat;