const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const extractedToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET || 'super_secret_jwt_key_here');
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
