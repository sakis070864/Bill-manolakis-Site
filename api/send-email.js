// --- Vercel Serverless Function for Sending Emails ---
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Log when the function is triggered
  console.log('--- Received request at /api/send-email ---');

  if (req.method !== 'POST') {
    console.log(`Request method was ${req.method}, expected POST.`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Log the data received from the form
  console.log('Request body:', req.body);

  try {
    // IMPORTANT: Replaced the placeholder strings with your actual email credentials.
    // This is a temporary solution for local development. For production,
    // you should set these as environment variables on Vercel.
    const EMAIL_HOST = "smtp.gmail.com";
    const EMAIL_PORT = 465;
    const EMAIL_SECURE = true; 
    const EMAIL_USER = "billmanolaki@gmail.com";
    const EMAIL_PASS = "vlierdgfpcpzvelv";
    const EMAIL_TO = "billmanolaki@gmail.com";

    console.log('Attempting to create Nodemailer transporter...');
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
    console.log('Transporter created successfully.');

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

    console.log('Attempting to send email...');
    await transporter.sendMail({
      from: `"Vasilis Website" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: subject,
      html: html,
    });
    console.log('Email sent successfully!');

    res.status(200).json({ success: true });

  } catch (error) {
    // This will log the specific error to your terminal
    console.error('---!!! ERROR in /api/send-email !!!---');
    console.error(error);
    res.status(500).json({ error: 'Failed to send email.', details: error.message });
  }
}
