const jwt = require('jsonwebtoken');

async function checkAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided',
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to authenticate token',
      });
    }

    const { role } = decoded;

    if (role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access Denied',
      });
    }
  });
}

module.exports = { checkAdmin };
