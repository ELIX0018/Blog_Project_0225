import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 获取所有友链（已通过审核）- 公开接口
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM links WHERE status = 1 ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('获取友链失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '获取友链失败'
      });
    }
    
    res.json({
      ec: '0',
      em: '获取友链成功',
      data: rows
    });
  });
});

// 获取所有友链（包括待审核）- 需要管理员权限
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  const sql = 'SELECT * FROM links ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('获取所有友链失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '获取友链失败'
      });
    }
    
    res.json({
      ec: '0',
      em: '获取友链成功',
      data: rows
    });
  });
});

// 获取待审核的友链申请列表 - 需要管理员权限
router.get('/pending', authenticateToken, requireAdmin, (req, res) => {
  const sql = 'SELECT * FROM links WHERE status = 0 ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('获取待审核友链失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '获取待审核友链失败'
      });
    }
    
    res.json({
      ec: '0',
      em: '获取待审核友链成功',
      data: rows
    });
  });
});

// 添加友链（申请）- 公开接口
router.post('/', (req, res) => {
  const { link_name, link_link, link_icon, link_describe, link_email } = req.body;
  
  if (!link_name || !link_link) {
    return res.status(400).json({
      ec: '-1',
      em: '友链名称和链接不能为空'
    });
  }
  
  const id = uuidv4();
  const status = 0; // 默认待审核
  
  const sql = `
    INSERT INTO links (id, link_name, link_link, link_icon, link_describe, link_email, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [id, link_name, link_link, link_icon || '', link_describe || '', link_email || '', status], (err) => {
    if (err) {
      console.error('添加友链失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '添加友链失败'
      });
    }
    
    res.json({
      ec: '0',
      em: '友链申请成功，等待审核',
      data: {
        id,
        link_name,
        link_link,
        link_icon,
        link_describe,
        link_email,
        status
      }
    });
  });
});

// 审核通过友链 - 需要管理员权限
router.put('/:id/approve', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    UPDATE links 
    SET status = 1, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ? AND status = 0
  `;
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('审核友链失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '审核友链失败'
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        ec: '-1',
        em: '友链申请不存在或已审核'
      });
    }
    
    res.json({
      ec: '0',
      em: '友链审核通过成功'
    });
  });
});

// 拒绝（删除）友链申请 - 需要管理员权限
router.delete('/:id/reject', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM links WHERE id = ? AND status = 0';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('拒绝友链申请失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '拒绝友链申请失败'
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        ec: '-1',
        em: '友链申请不存在或已审核'
      });
    }
    
    res.json({
      ec: '0',
      em: '已拒绝友链申请'
    });
  });
});

// 更新友链状态 - 需要管理员权限
router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (status !== 0 && status !== 1) {
    return res.status(400).json({
      ec: '-1',
      em: '状态值只能是0或1'
    });
  }
  
  const sql = `
    UPDATE links 
    SET status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  
  db.run(sql, [status, id], function(err) {
    if (err) {
      console.error('更新友链状态失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '更新友链状态失败'
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        ec: '-1',
        em: '友链不存在'
      });
    }
    
    res.json({
      ec: '0',
      em: '更新友链状态成功'
    });
  });
});

// 删除友链 - 需要管理员权限
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM links WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('删除友链失败:', err.message);
      return res.status(500).json({
        ec: '-1',
        em: '删除友链失败'
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        ec: '-1',
        em: '友链不存在'
      });
    }
    
    res.json({
      ec: '0',
      em: '删除友链成功'
    });
  });
});

export default router;
