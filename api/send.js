// Email gönderme endpoint'i
// multipart/form-data veya application/x-www-form-urlencoded kabul eder: name, email, message
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    ZOHO_SMTP_HOST,
    ZOHO_SMTP_PORT,
    ZOHO_SMTP_USER,
    ZOHO_SMTP_PASS,
    MAIL_FROM,
    MAIL_TO
  } = process.env;

  // Credentials kontrolü
  if (!ZOHO_SMTP_HOST || !ZOHO_SMTP_PORT || !ZOHO_SMTP_USER || !ZOHO_SMTP_PASS || !MAIL_FROM || !MAIL_TO) {
    return res.status(500).json({ error: 'Email configuration missing' });
  }

  try {
    // Form data parse et
    // Vercel Serverless Functions'da multipart/form-data için req.body otomatik parse edilir
    // veya application/x-www-form-urlencoded için de req.body kullanılır
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }

    // Zoho SMTP transporter oluştur
    const transporter = nodemailer.createTransport({
      host: ZOHO_SMTP_HOST,
      port: parseInt(ZOHO_SMTP_PORT),
      secure: parseInt(ZOHO_SMTP_PORT) === 465, // 465 için SSL (secure: true), 587 için TLS (secure: false)
      auth: {
        user: ZOHO_SMTP_USER,
        pass: ZOHO_SMTP_PASS
      }
    });

    // Email içeriği
    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Email gönder
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: 'New form submission',
      text: emailBody
    });

    console.log('Email sent:', info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
