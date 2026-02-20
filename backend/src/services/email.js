const logger = require('../config/logger');

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jamnasindo.id';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@jamnasindo.id';

/**
 * Send email notification for new contact message
 * @param {Object} messageData - The contact form data
 */
async function sendContactNotification(messageData) {
  if (!RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY not configured, skipping email notification');
    return { success: false, reason: 'API_KEY_MISSING' };
  }

  const { name, email, phone, service_type, message } = messageData;

  const emailPayload = {
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    subject: `Pesan Baru dari Website - ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Baru</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8faf8; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #387C44 0%, #2d6a37 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 Pesan Baru</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Seseorang telah mengirim pesan melalui website</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f0;">
                  <strong style="color: #374151; display: inline-block; width: 120px;">Nama</strong>
                  <span style="color: #1f2937;">${escapeHtml(name)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f0;">
                  <strong style="color: #374151; display: inline-block; width: 120px;">Email</strong>
                  <a href="mailto:${escapeHtml(email || '')}" style="color: #387C44; text-decoration: none;">${escapeHtml(email || '-')}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f0;">
                  <strong style="color: #374151; display: inline-block; width: 120px;">Telepon</strong>
                  <span style="color: #1f2937;">${escapeHtml(phone || '-')}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f0;">
                  <strong style="color: #374151; display: inline-block; width: 120px;">Layanan</strong>
                  <span style="color: #1f2937;">${escapeHtml(service_type || 'Tidak dipilih')}</span>
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px;">
              <strong style="color: #374151; display: block; margin-bottom: 12px;">Pesan:</strong>
              <div style="background: #f8faf8; padding: 16px; border-radius: 12px; border-left: 4px solid #387C44; color: #374151; line-height: 1.6;">
                ${escapeHtml(message).replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8faf8; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Email ini dikirim otomatis dari website <strong>Jamnasindo</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error('Resend API error:', result);
      return { success: false, reason: 'API_ERROR', error: result };
    }

    logger.info('Email notification sent successfully', { id: result.id });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error('Failed to send email notification:', error);
    return { success: false, reason: 'NETWORK_ERROR', error: error.message };
  }
}

/**
 * Send auto-reply to the person who submitted the form
 */
async function sendAutoReply(messageData) {
  if (!RESEND_API_KEY || !messageData.email) {
    return { success: false, reason: 'MISSING_CONFIG_OR_EMAIL' };
  }

  const { name, email } = messageData;

  const emailPayload = {
    from: FROM_EMAIL,
    to: [email],
    subject: 'Terima Kasih - Pesan Anda Telah Kami Terima',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8faf8; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #387C44 0%, #2d6a37 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Terima Kasih!</h1>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Yth. <strong>${escapeHtml(name)}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Terima kasih telah menghubungi <strong>JNI Consultant</strong>. Pesan Anda telah kami terima dan tim kami akan segera merespons dalam waktu 1x24 jam kerja.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Jika Anda membutuhkan respons lebih cepat, silakan hubungi kami via WhatsApp di <a href="https://wa.me/6281234567890" style="color: #387C44;">+62 812-3456-7890</a>.
            </p>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Hormat kami,<br>
                <strong style="color: #387C44;">Tim JNI Consultant</strong>
              </p>
            </div>
          </div>
          <div style="background: #f8faf8; padding: 20px 32px; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Jl. Condet Raya No 103E, Kramatjati, Jakarta Timur
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error('Auto-reply error:', result);
      return { success: false, error: result };
    }

    logger.info('Auto-reply sent successfully', { to: email });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error('Failed to send auto-reply:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

module.exports = {
  sendContactNotification,
  sendAutoReply
};
