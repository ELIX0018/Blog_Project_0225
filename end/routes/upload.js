import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持图片文件格式 (JPEG, JPG, PNG, GIF, WebP)'), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 默认10MB
  },
  fileFilter: fileFilter
});

// 单文件上传
router.post('/single', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ec: '-1',
        em: '请选择要上传的文件'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      ec: '0',
      em: '上传成功',
      data: {
        src: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({
      ec: '-1',
      em: '文件上传失败'
    });
  }
});

// 多文件上传
router.post('/multiple', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        ec: '-1',
        em: '请选择要上传的文件'
      });
    }

    const files = req.files.map(file => ({
      src: `/uploads/${file.filename}`,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      ec: '0',
      em: '上传成功',
      data: files
    });
  } catch (error) {
    console.error('多文件上传错误:', error);
    res.status(500).json({
      ec: '-1',
      em: '文件上传失败'
    });
  }
});

// 文章图片上传（专门为文章编辑器设计）
router.post('/article', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ec: '-1',
        em: '请选择要上传的图片'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      ec: '0',
      em: '上传成功',
      data: {
        url: fileUrl,
        alt: req.file.originalname,
        href: fileUrl
      }
    });
  } catch (error) {
    console.error('文章图片上传错误:', error);
    res.status(500).json({
      ec: '-1',
      em: '图片上传失败'
    });
  }
});

// 头像上传
router.post('/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ec: '-1',
        em: '请选择要上传的头像'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      ec: '0',
      em: '头像上传成功',
      data: {
        avatarUrl: fileUrl
      }
    });
  } catch (error) {
    console.error('头像上传错误:', error);
    res.status(500).json({
      ec: '-1',
      em: '头像上传失败'
    });
  }
});

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        ec: '-1',
        em: '文件大小超过限制'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        ec: '-1',
        em: '文件数量超过限制'
      });
    }
  }
  
  if (error.message.includes('只支持图片文件格式')) {
    return res.status(400).json({
      ec: '-1',
      em: error.message
    });
  }

  console.error('上传错误:', error);
  res.status(500).json({
    ec: '-1',
    em: '文件上传失败'
  });
});

export default router;