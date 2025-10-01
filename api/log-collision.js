// Vercel Serverless Function
// Save this as: api/log-collision.js in your project root

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS for your VR app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the Google Apps Script URL from environment variable
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    
    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error: Missing GOOGLE_SCRIPT_URL' 
      });
    }

    // Forward the collision data to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // Return the response from Google Sheets
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error logging collision:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to log collision: ' + error.message 
    });
  }
}