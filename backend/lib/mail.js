// backend/lib/mail.js
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT ?? 587);

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465, // 465면 TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
