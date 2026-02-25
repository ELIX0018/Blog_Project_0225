import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateComment, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// 获取留言列表（支持分页）
router.get('/', optionalAuth, validatePagination, (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  // 获取留言总数
  const countSql = 'SELECT COUNT(*) as total FROM guestbook WHERE parent_id IS NULL';
  
  db.get(countSql, [], (err, countResult) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    // 获取留言列表
    const sql = `
      SELECT 
        g.id,
        g.content,
        g.parent_id as parentId,
        g.address,
        g.likes,
        g.content_img as contentImg,
        g.created_at as createTime,
        u.id as userId,
        u.username,
        u.user_head as avatar,
        u.user_power_id as userPowerId
      FROM guestbook g
      LEFT JOIN users u ON g.user_id = u.id
      WHERE g.parent_id IS NULL
      ORDER BY g.created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.all(sql, [parseInt(limit), offset], (err, comments) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      // 获取每条留言的回复
      const getRepliesPromises = comments.map(comment => {
        return new Promise((resolve) => {
          const replySql = `
            SELECT 
              g.id,
              g.content,
              g.parent_id as parentId,
              g.address,
              g.likes,
              g.content_img as contentImg,
              g.created_at as createTime,
              u.id as userId,
              u.username,
              u.user_head as avatar,
              u.user_power_id as userPowerId
            FROM guestbook g
            LEFT JOIN users u ON g.user_id = u.id
            WHERE g.parent_id = ?
            ORDER BY g.created_at ASC
          `;

          db.all(replySql, [comment.id], (err, replies) => {
            if (err) {
              comment.reply = [];
            } else {
              comment.reply = replies;
            }
            resolve(comment);
          });
        });
      });

      Promise.all(getRepliesPromises).then(commentsWithReplies => {
        res.json({
          ec: '0',
          em: '获取成功',
          data: {
            comments: commentsWithReplies,
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

// 提交留言
router.post('/', authenticateToken, validateComment, (req, res) => {
  const { content, parentId } = req.body;
  const commentId = `comment_${uuidv4()}`;

  const sql = `
    INSERT INTO guestbook (id, content, parent_id, user_id, address)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    commentId,
    content,
    parentId || null,
    req.user.userId,
    '未知' // 这里可以集成IP定位服务
  ], function(err) {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '提交留言失败'
      });
    }

    // 获取新创建的留言信息
    const getSql = `
      SELECT 
        g.id,
        g.content,
        g.parent_id as parentId,
        g.address,
        g.likes,
        g.content_img as contentImg,
        g.created_at as createTime,
        u.id as userId,
        u.username,
        u.user_head as avatar,
        u.user_power_id as userPowerId
      FROM guestbook g
      LEFT JOIN users u ON g.user_id = u.id
      WHERE g.id = ?
    `;

    db.get(getSql, [commentId], (err, newComment) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '获取留言信息失败'
        });
      }

      res.json({
        ec: '0',
        em: '留言成功',
        data: newComment
      });
    });
  });
});

// 删除留言
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // 检查留言是否存在且属于当前用户
  const checkSql = 'SELECT user_id FROM guestbook WHERE id = ?';
  db.get(checkSql, [id], (err, comment) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!comment) {
      return res.status(404).json({
        ec: '-1',
        em: '留言不存在'
      });
    }

    if (comment.user_id !== req.user.userId && req.user.userPowerId < 999) {
      return res.status(403).json({
        ec: '-1',
        em: '无权删除此留言'
      });
    }

    // 删除留言及其回复
    const deleteSql = 'DELETE FROM guestbook WHERE id = ? OR parent_id = ?';
    db.run(deleteSql, [id, id], function(err) {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '删除留言失败'
        });
      }

      res.json({
        ec: '0',
        em: '删除成功'
      });
    });
  });
});

// 点赞留言
router.post('/:id/like', authenticateToken, (req, res) => {
  const { id } = req.params;

  // 检查是否已经点赞
  const checkLikeSql = 'SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?';
  db.get(checkLikeSql, [id, req.user.userId], (err, like) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (like) {
      // 取消点赞
      db.run('DELETE FROM comment_likes WHERE id = ?', [like.id], function(err) {
        if (err) {
          return res.status(500).json({
            ec: '-1',
            em: '取消点赞失败'
          });
        }

        db.run('UPDATE guestbook SET likes = likes - 1 WHERE id = ?', [id]);
        
        res.json({
          ec: '0',
          em: '取消点赞成功'
        });
      });
    } else {
      // 添加点赞
      const likeId = `like_${uuidv4()}`;
      db.run('INSERT INTO comment_likes (id, comment_id, user_id) VALUES (?, ?, ?)', 
        [likeId, id, req.user.userId], function(err) {
        if (err) {
          return res.status(500).json({
            ec: '-1',
            em: '点赞失败'
          });
        }

        db.run('UPDATE guestbook SET likes = likes + 1 WHERE id = ?', [id]);
        
        res.json({
          ec: '0',
          em: '点赞成功'
        });
      });
    }
  });
});

// 获取文章评论（与留言板类似，但关联文章）
router.get('/article/:articleId', optionalAuth, validatePagination, (req, res) => {
  const { articleId } = req.params;
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  // 获取评论总数
  const countSql = 'SELECT COUNT(*) as total FROM comments WHERE article_id = ? AND parent_id IS NULL';
  
  db.get(countSql, [articleId], (err, countResult) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    // 获取评论列表
    const sql = `
      SELECT 
        c.id,
        c.content,
        c.parent_id as parentId,
        c.address,
        c.likes,
        c.content_img as contentImg,
        c.created_at as createTime,
        u.id as userId,
        u.username,
        u.user_head as avatar,
        u.user_power_id as userPowerId
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ? AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.all(sql, [articleId, parseInt(limit), offset], (err, comments) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      // 获取每条评论的回复
      const getRepliesPromises = comments.map(comment => {
        return new Promise((resolve) => {
          const replySql = `
            SELECT 
              c.id,
              c.content,
              c.parent_id as parentId,
              c.address,
              c.likes,
              c.content_img as contentImg,
              c.created_at as createTime,
              u.id as userId,
              u.username,
              u.user_head as avatar,
              u.user_power_id as userPowerId
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.parent_id = ?
            ORDER BY c.created_at ASC
          `;

          db.all(replySql, [comment.id], (err, replies) => {
            if (err) {
              comment.reply = [];
            } else {
              comment.reply = replies;
            }
            resolve(comment);
          });
        });
      });

      Promise.all(getRepliesPromises).then(commentsWithReplies => {
        res.json({
          ec: '0',
          em: '获取成功',
          data: {
            comments: commentsWithReplies,
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

// 提交文章评论
router.post('/article/:articleId', authenticateToken, validateComment, (req, res) => {
  const { articleId } = req.params;
  const { content, parentId } = req.body;
  const commentId = `comment_${uuidv4()}`;

  const sql = `
    INSERT INTO comments (id, article_id, content, parent_id, user_id, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    commentId,
    articleId,
    content,
    parentId || null,
    req.user.userId,
    '未知'
  ], function(err) {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '提交评论失败'
      });
    }

    // 更新文章评论数
    if (!parentId) {
      db.run('UPDATE articles SET comment_count = comment_count + 1 WHERE id = ?', [articleId]);
    }

    res.json({
      ec: '0',
      em: '评论成功'
    });
  });
});

export default router;