// Email gönderme endpoint'i
// JSON body kabul eder: name, email, message, attachments
import nodemailer from 'nodemailer';

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB per file
const MAX_TOTAL_ATTACHMENT_BYTES = 3 * 1024 * 1024; // 3MB total

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
    // JSON body parse et
    // Vercel Serverless Functions'da JSON body otomatik parse edilir
    let body = req.body;
    
    // Eğer string ise parse et (bazı durumlarda gerekebilir)
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    
    const { name, email, subject, message, html, attachments } = body;

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

    // Prepare attachments (convert base64 to Buffer)
    const emailAttachments = [];
    let totalAttachmentBytes = 0;
    if (attachments && Array.isArray(attachments)) {
      console.log('Processing attachments:', attachments.length);
      for (const att of attachments) {
        if (att.content && att.filename) {
          console.log('Adding attachment:', att.filename, 'Content type:', att.contentType, 'Content length:', att.content.length);
          try {
            const buffer = Buffer.from(att.content, 'base64');
            if (buffer.length > MAX_ATTACHMENT_BYTES) {
              return res.status(413).json({ error: 'Attachment too large (max 2MB per file)' });
            }
            totalAttachmentBytes += buffer.length;
            if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
              return res.status(413).json({ error: 'Total attachments too large (max 3MB)' });
            }
            emailAttachments.push({
              filename: att.filename,
              content: buffer,
              contentType: att.contentType || undefined
            });
            console.log('Attachment added successfully, buffer size:', buffer.length);
          } catch (error) {
            console.error('Error processing attachment:', att.filename, error);
          }
        } else {
          console.warn('Invalid attachment:', att);
        }
      }
    } else {
      console.log('No attachments or attachments is not an array');
    }
    
    console.log('Final email attachments count:', emailAttachments.length);

    // Email gönder
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: subject || 'New form submission',
      text: emailBody,
      html: (typeof html === 'string' && html.trim()) ? html : undefined,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined
    });

    console.log('Email sent:', info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
