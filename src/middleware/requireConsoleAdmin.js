import crypto from 'node:crypto';

const requireConsoleAdmin = (req, res, next) => {
  const expected = process.env.CONSOLE_ADMIN_TOKEN || '';
  const supplied = req.get('x-console-admin-key') || '';
  if (!expected) {
    return res.status(503).json({ success: false, message: 'Backend admin access is not configured. Set CONSOLE_ADMIN_TOKEN in the backend .env file.' });
  }
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (expectedBuffer.length !== suppliedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)) {
    return res.status(401).json({ success: false, message: 'Enter the backend admin token to access 2Factor settings.' });
  }
  return next();
};

export default requireConsoleAdmin;
