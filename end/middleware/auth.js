import jwt from 'jsonwebtoken';

// JWT验证中间件
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      ec: '-1',
      em: '访问令牌不存在'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        ec: '-1',
        em: '令牌无效或已过期'
      });
    }
    
    req.user = user;
    next();
  });
};

// 可选认证中间件（不强制要求登录）
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  
  next();
};

// 管理员权限验证
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.userPowerId < 999) {
    return res.status(403).json({
      ec: '-1',
      em: '需要管理员权限'
    });
  }
  next();
};