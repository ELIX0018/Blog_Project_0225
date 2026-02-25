import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// 导入路由
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import diaryRoutes from './routes/diaries.js';
import guestbookRoutes from './routes/guestbook.js';
import uploadRoutes from './routes/upload.js';
import linksRoutes from './routes/links.js';

// 导入数据库初始化
import { initDatabase } from './config/database.js';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

// 安全中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 压缩中间件
app.use(compression());

// 日志中间件
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    ec: '-1',
    em: '请求过于频繁，请稍后再试'
  }
});
app.use(limiter);

// CORS配置
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:4002',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/links', linksRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    ec: '0',
    em: '服务运行正常',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    ec: '-1',
    em: '接口不存在'
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      ec: '-1',
      em: '请求参数验证失败',
      data: err.details
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      ec: '-1',
      em: 'Token无效'
    });
  }
  
  res.status(500).json({
    ec: '-1',
    em: '服务器内部错误'
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 健康检查: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();

export default app;