// --- Vercel Serverless Function for Sending Emails ---
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // SECURE: Email credentials are now loaded from Vercel's Environment Variables.
    // The hardcoded constants have been removed.
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true', // Convert string to boolean
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { formType, ...data } = req.body;
    let subject, html;

    if (formType === 'contact') {
      subject = `New Contact Form Message from ${data.name}`;
      html = `
        <p>You received a new message from your website's contact form:</p>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `;
    } else if (formType === 'chatbot') {
      subject = `New Project Intake from AI Assistant`;
      html = `
        <p>The AI Assistant has completed a project intake:</p>
        <ul>
          <li><strong>Name:</strong> ${data.name || 'Not provided'}</li>
          <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
          <li><strong>Location:</strong> ${data.location || 'Not provided'}</li>
          <li><strong>Project Type:</strong> ${data.projectType || 'Not provided'}</li>
          <li><strong>Description:</strong> ${data.description || 'Not provided'}</li>
        </ul>
      `;
    } else {
        return res.status(400).json({ error: 'Invalid form type.' });
    }

    await transporter.sendMail({
      from: `"Vasilis Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: subject,
      html: html,
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('---!!! ERROR in /api/send-email !!!---');
    console.error(error);
    res.status(500).json({ error: 'Failed to send email.', details: error.message });
  }
}
