// --- Vercel Serverless Function to securely provide the INTERNAL_KEY ---
// This file will be deployed at the `/api/internal-key` endpoint.

export default function handler(req, res) {
  // Ensure we only respond to GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Securely access the INTERNAL_KEY from Vercel's environment variables
  const internalKey = process.env.INTERNAL_KEY;

  // Check if the environment variable is set on Vercel
  // This is an important error check
  if (!internalKey) {
    console.error("CRITICAL: INTERNAL_KEY environment variable is not set on Vercel.");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Send the key in a JSON response to the front-end component that will ask for it
  res.status(200).json({ key: internalKey });
}
