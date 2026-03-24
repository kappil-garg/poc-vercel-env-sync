/**
 * Vercel serverless function that reports whether GOOGLE_OAUTH_CLIENT_ID is set.
 * The value is never exposed only its presence is reported.
 */
export default function handler(req, res) {
  const value = process.env.GOOGLE_OAUTH_CLIENT_ID;
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    GOOGLE_OAUTH_CLIENT_ID: value ? 'set' : 'not set',
    note: 'Value is never returned; only presence is reported.',
  });
}
