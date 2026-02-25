import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateArticle, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// 获取文章列表（支持分页和搜索）
router.get('/', optionalAuth, validatePagination, (req, res) => {
  const { page, limit, search } = req.query;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      a.id,
      a.title,
      a.summary,
      a.labels,
      a.view_count as viewCount,
      a.like_count as likeCount,
      a.comment_count as commentCount,
      a.status,
      a.created_at as createdAt,
      a.updated_at as updatedAt,
      u.username as userName,
      u.user_head as userHead
    FROM articles a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.status = 1
  `;

  let countSql = 'SELECT COUNT(*) as total FROM articles WHERE status = 1';
  let params = [];

  if (search) {
    sql += ' AND (a.title LIKE ? OR a.content LIKE ?)';
    countSql += ' AND (title LIKE ? OR content LIKE ?)';
    params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }

  sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  // 获取总数
  db.get(countSql, params.slice(0, search ? 2 : 0), (err, countResult) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    // 获取文章列表
    db.all(sql, params, (err, articles) => {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '数据库查询失败'
        });
      }

      // 解析标签JSON
      const formattedArticles = articles.map(article => ({
        ...article,
        labels: article.labels ? JSON.parse(article.labels) : []
      }));

      res.json({
        ec: '0',
        em: '获取成功',
        data: {
          articles: formattedArticles,
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

// 获取文章详情
router.get('/:id', optionalAuth, (req, res) => {
  const { id } = req.params;

  // 增加阅读量
  db.run('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [id]);

  const sql = `
    SELECT 
      a.id,
      a.title,
      a.content,
      a.summary,
      a.labels,
      a.view_count as viewCount,
      a.like_count as likeCount,
      a.comment_count as commentCount,
      a.status,
      a.created_at as createdAt,
      a.updated_at as updatedAt,
      u.id as userId,
      u.username as userName,
      u.user_head as userHead
    FROM articles a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `;

  db.get(sql, [id], (err, article) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!article) {
      return res.status(404).json({
        ec: '-1',
        em: '文章不存在'
      });
    }

    // 解析标签JSON
    article.labels = article.labels ? JSON.parse(article.labels) : [];

    res.json({
      ec: '0',
      em: '获取成功',
      data: article
    });
  });
});

// 创建文章
router.post('/', authenticateToken, validateArticle, (req, res) => {
  const { title, content, summary, labels, status = 1 } = req.body;
  const articleId = `article_${uuidv4()}`;

  const sql = `
    INSERT INTO articles (id, title, content, summary, labels, user_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    articleId,
    title,
    content,
    summary,
    labels ? JSON.stringify(labels) : '[]',
    req.user.userId,
    status
  ], function(err) {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '创建文章失败'
      });
    }

    res.json({
      ec: '0',
      em: '创建成功',
      data: {
        id: articleId
      }
    });
  });
});

// 更新文章
router.put('/:id', authenticateToken, validateArticle, (req, res) => {
  const { id } = req.params;
  const { title, content, summary, labels, status } = req.body;

  // 检查文章是否存在且属于当前用户
  const checkSql = 'SELECT user_id FROM articles WHERE id = ?';
  db.get(checkSql, [id], (err, article) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!article) {
      return res.status(404).json({
        ec: '-1',
        em: '文章不存在'
      });
    }

    if (article.user_id !== req.user.userId && req.user.userPowerId < 999) {
      return res.status(403).json({
        ec: '-1',
        em: '无权修改此文章'
      });
    }

    const updateSql = `
      UPDATE articles 
      SET title = ?, content = ?, summary = ?, labels = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateSql, [
      title,
      content,
      summary,
      labels ? JSON.stringify(labels) : '[]',
      status,
      id
    ], function(err) {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '更新文章失败'
        });
      }

      res.json({
        ec: '0',
        em: '更新成功'
      });
    });
  });
});

// 删除文章
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // 检查文章是否存在且属于当前用户
  const checkSql = 'SELECT user_id FROM articles WHERE id = ?';
  db.get(checkSql, [id], (err, article) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (!article) {
      return res.status(404).json({
        ec: '-1',
        em: '文章不存在'
      });
    }

    if (article.user_id !== req.user.userId && req.user.userPowerId < 999) {
      return res.status(403).json({
        ec: '-1',
        em: '无权删除此文章'
      });
    }

    const deleteSql = 'DELETE FROM articles WHERE id = ?';
    db.run(deleteSql, [id], function(err) {
      if (err) {
        return res.status(500).json({
          ec: '-1',
          em: '删除文章失败'
        });
      }

      res.json({
        ec: '0',
        em: '删除成功'
      });
    });
  });
});

// 点赞文章
router.post('/:id/like', authenticateToken, (req, res) => {
  const { id } = req.params;

  // 检查是否已经点赞
  const checkLikeSql = 'SELECT id FROM article_likes WHERE article_id = ? AND user_id = ?';
  db.get(checkLikeSql, [id, req.user.userId], (err, like) => {
    if (err) {
      return res.status(500).json({
        ec: '-1',
        em: '数据库查询失败'
      });
    }

    if (like) {
      // 取消点赞
      db.run('DELETE FROM article_likes WHERE id = ?', [like.id], function(err) {
        if (err) {
          return res.status(500).json({
            ec: '-1',
            em: '取消点赞失败'
          });
        }

        db.run('UPDATE articles SET like_count = like_count - 1 WHERE id = ?', [id]);
        
        res.json({
          ec: '0',
          em: '取消点赞成功'
        });
      });
    } else {
      // 添加点赞
      const likeId = `like_${uuidv4()}`;
      db.run('INSERT INTO article_likes (id, article_id, user_id) VALUES (?, ?, ?)', 
        [likeId, id, req.user.userId], function(err) {
        if (err) {
          return res.status(500).json({
            ec: '-1',
            em: '点赞失败'
          });
        }

        db.run('UPDATE articles SET like_count = like_count + 1 WHERE id = ?', [id]);
        
        res.json({
          ec: '0',
          em: '点赞成功'
        });
      });
    }
  });
});

export default router;