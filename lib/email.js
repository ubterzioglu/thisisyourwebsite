// Zoho Mail Helper
// Email gönderme fonksiyonu (Zoho SMTP kullanarak)
import nodemailer from 'nodemailer';

export async function sendIntakeEmail(intakeData) {
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
    console.warn('Email credentials missing, skipping email send');
    return { success: false, error: 'Email credentials not configured' };
  }

  try {
    // Zoho SMTP transporter oluştur
    const transporter = nodemailer.createTransport({
      host: ZOHO_SMTP_HOST,
      port: parseInt(ZOHO_SMTP_PORT),
      secure: parseInt(ZOHO_SMTP_PORT) === 465, // 465 için SSL, 587 için TLS
      auth: {
        user: ZOHO_SMTP_USER,
        pass: ZOHO_SMTP_PASS
      }
    });

    // Email içeriği oluştur
    const mailOptions = {
      from: MAIL_FROM,
      to: MAIL_TO,
      subject: `Yeni Form Gönderimi - ${intakeData.public_slug}`,
      text: formatEmailText(intakeData),
      html: formatEmailHTML(intakeData)
    };

    // Email gönder
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

// Plain text email formatı
function formatEmailText(intakeData) {
  const { user_summary, long_text, public_slug, answers } = intakeData;
  
  let text = `Yeni Form Gönderimi\n`;
  text += `==================\n\n`;
  text += `Slug: ${public_slug}\n`;
  text += `Tarih: ${new Date().toLocaleString('tr-TR')}\n\n`;
  text += `20 Soru Özeti:\n${user_summary || 'Özet bulunamadı'}\n\n`;
  
  if (long_text && long_text.trim()) {
    text += `Ek Notlar:\n${long_text}\n\n`;
  }
  
  text += `---\n`;
  text += `Detaylı bilgiler için admin panelini kontrol edin.\n`;
  
  return text;
}

// HTML email formatı
function formatEmailHTML(intakeData) {
  const { user_summary, long_text, public_slug, answers } = intakeData;
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .summary { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; white-space: pre-wrap; }
        .notes { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107; white-space: pre-wrap; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        h2 { margin-top: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Yeni Form Gönderimi</h2>
        </div>
        <div class="content">
          <p><strong>Slug:</strong> ${public_slug}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <h3>20 Soru Özeti</h3>
          <div class="summary">${(user_summary || 'Özet bulunamadı').replace(/\n/g, '<br>')}</div>
          
          ${long_text && long_text.trim() ? `
            <h3>Ek Notlar</h3>
            <div class="notes">${long_text.replace(/\n/g, '<br>')}</div>
          ` : ''}
          
          <div class="footer">
            <p>Detaylı bilgiler için admin panelini kontrol edin.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}
