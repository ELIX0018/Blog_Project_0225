import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// 用户注册
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, email, password, userId } = req.body;

    // 检查用户名是否已存在
    const checkUserSql = 'SELECT id FROM users WHERE username = ? OR email = ?';
    db.get(checkUserSql, [username, email], async (err, row) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      if (row) {
        return res.status(400).json({
          ec: '-1',
          em: '用户名或邮箱已存在'
        });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);
      const userIdFinal = userId || `user_${uuidv4()}`;

      // 插入新用户
      const insertUserSql = `
        INSERT INTO users (id, username, email, password)
        VALUES (?, ?, ?, ?)
      `;

      db.run(insertUserSql, [userIdFinal, username, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({
            ec: '-1',
            em: '用户注册失败'
          });
        }

        // 注册成功后自动登录
        const token = jwt.sign(
          { 
            userId: userIdFinal, 
            username: username,
            userPowerId: 1 
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // 获取用户信息
        const getUserSql = 'SELECT id, username, email, user_head as userHead, user_power_id as userPowerId FROM users WHERE id = ?';
        db.get(getUserSql, [userIdFinal], (err, user) => {
          if (err) {
            return res.status(500).json({
              ec: '-1',
              em: '获取用户信息失败'
            });
          }

          res.json({
            ec: '0',
            em: '注册成功',
            data: {
              token: token,
              userInfo: {
                userId: user.id,
                userName: user.username,
                userHead: user.userHead,
                userPowerId: user.userPowerId,
                email: user.email
              }
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      ec: '-1',
      em: '服务器内部错误'
    });
  }
});

// 用户登录
router.post('/login', validateLogin, (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.get(sql, [username, username], async (err, user) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!user) {
      return res.status(401).json({
        ec: '-1',
        em: '用户名或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        ec: '-1',
        em: '用户名或密码错误'
      });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        userPowerId: user.user_power_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      ec: '0',
      em: '登录成功',
      data: {
        token: token,
        userInfo: {
          userId: user.id,
          userName: user.username,
          userHead: user.user_head,
          userPowerId: user.user_power_id,
          email: user.email,
          qqId: user.qq_id,
          qqName: user.qq_name,
          qqImg: user.qq_img
        }
      }
    });
  });
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      ec: '-1',
      em: '未提供访问令牌'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ec: '-1',
        em: '令牌无效'
      });
    }

    const sql = 'SELECT id, username, email, user_head as userHead, user_power_id as userPowerId, qq_id as qqId, qq_name as qqName, qq_img as qqImg FROM users WHERE id = ?';
    db.get(sql, [decoded.userId], (err, user) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      if (!user) {
        return res.status(404).json({
          ec: '-1',
          em: '用户不存在'
        });
      }

      res.json({
        ec: '0',
        em: '获取成功',
        data: user
      });
    });
  });
});

// 更新用户信息
router.put('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      ec: '-1',
      em: '未提供访问令牌'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ec: '-1',
        em: '令牌无效'
      });
    }

    const { email, userHead } = req.body;
    
    const sql = 'UPDATE users SET email = ?, user_head = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [email, userHead, decoded.userId], function(err) {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '更新用户信息失败'
        });
      }

      res.json({
        ec: '0',
        em: '更新成功'
      });
    });
  });
});

export default router;