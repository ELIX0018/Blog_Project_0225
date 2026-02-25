import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateDiary, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// 获取日记列表（支持分页）
router.get('/', optionalAuth, validatePagination, (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  // 获取日记总数
  const countSql = 'SELECT COUNT(*) as total FROM diaries';
  
  db.get(countSql, [], (err, countResult) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    // 获取日记列表
    const sql = `
      SELECT 
        d.id,
        d.content,
        d.created_at as diaryDate,
        d.updated_at as updatedAt,
        u.id as userId,
        u.username as userName,
        u.user_head as userHead,
        u.qq_id as qqId,
        u.qq_name as qqName,
        u.qq_img as qqImg
      FROM diaries d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.all(sql, [parseInt(limit), offset], (err, diaries) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      res.json({
        ec: '0',
        em: '获取成功',
        data: {
          diaries: diaries,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: countResult.total,
            totalPages: Math.ceil(countResult.total / limit)
          }
        }
      });
    });
  });
});

// 获取日记详情
router.get('/:id', optionalAuth, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      d.id,
      d.content,
      d.created_at as diaryDate,
      d.updated_at as updatedAt,
      u.id as userId,
      u.username as userName,
      u.user_head as userHead,
      u.qq_id as qqId,
      u.qq_name as qqName,
      u.qq_img as qqImg
    FROM diaries d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.id = ?
  `;

  db.get(sql, [id], (err, diary) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!diary) {
      return res.status(404).json({
        ec: '-1',
        em: '日记不存在'
      });
    }

    res.json({
      ec: '0',
      em: '获取成功',
      data: diary
    });
  });
});

// 创建日记
router.post('/', authenticateToken, validateDiary, (req, res) => {
  const { content } = req.body;
  const diaryId = `diary_${uuidv4()}`;

  const sql = `
    INSERT INTO diaries (id, content, user_id)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [diaryId, content, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '创建日记失败'
      });
    }

    res.json({
      ec: '0',
      em: '创建成功',
      data: {
        id: diaryId
      }
    });
  });
});

// 更新日记
router.put('/:id', authenticateToken, validateDiary, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // 检查日记是否存在且属于当前用户
  const checkSql = 'SELECT user_id FROM diaries WHERE id = ?';
  db.get(checkSql, [id], (err, diary) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!diary) {
      return res.status(404).json({
        ec: '-1',
        em: '日记不存在'
      });
    }

    if (diary.user_id !== req.user.userId && req.user.userPowerId < 999) {
      return res.status(403).json({
        ec: '-1',
        em: '无权修改此日记'
      });
    }

    const updateSql = 'UPDATE diaries SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(updateSql, [content, id], function(err) {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '更新日记失败'
        });
      }

      res.json({
        ec: '0',
        em: '更新成功'
      });
    });
  });
});

// 删除日记
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // 检查日记是否存在且属于当前用户
  const checkSql = 'SELECT user_id FROM diaries WHERE id = ?';
  db.get(checkSql, [id], (err, diary) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!diary) {
      return res.status(404).json({
        ec: '-1',
        em: '日记不存在'
      });
    }

    if (diary.user_id !== req.user.userId && req.user.userPowerId < 999) {
      return res.status(403).json({
        ec: '-1',
        em: '无权删除此日记'
      });
    }

    const deleteSql = 'DELETE FROM diaries WHERE id = ?';
    db.run(deleteSql, [id], function(err) {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '删除日记失败'
        });
      }

      res.json({
        ec: '0',
        em: '删除成功'
      });
    });
  });
});

// 获取用户个人日记列表
router.get('/user/:userId', optionalAuth, validatePagination, (req, res) => {
  const { userId } = req.params;
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  // 检查用户是否存在
  const checkUserSql = 'SELECT id FROM users WHERE id = ?';
  db.get(checkUserSql, [userId], (err, user) => {
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

    // 获取用户日记总数
    const countSql = 'SELECT COUNT(*) as total FROM diaries WHERE user_id = ?';
    
    db.get(countSql, [userId], (err, countResult) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      // 获取用户日记列表
      const sql = `
        SELECT 
          d.id,
          d.content,
          d.created_at as diaryDate,
          d.updated_at as updatedAt,
          u.id as userId,
          u.username as userName,
          u.user_head as userHead
        FROM diaries d
        LEFT JOIN users u ON d.user_id = u.id
        WHERE d.user_id = ?
        ORDER BY d.created_at DESC
        LIMIT ? OFFSET ?
      `;

      db.all(sql, [userId, parseInt(limit), offset], (err, diaries) => {
        if (err) {
          return res.status(500).json({
            ec: '-1',
            em: '数据库查询失败'
          });
        }

        res.json({
          ec: '0',
          em: '获取成功',
          data: {
            diaries: diaries,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: countResult.total,
              totalPages: Math.ceil(countResult.total / limit)
            }
          }
        });
      });
    });
  });
});

export default router;