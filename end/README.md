# 张苹果博客后端系统

这是一个完整的博客后端系统，基于 Node.js + Express + SQLite 构建，与前端 Vue 3 应用完全兼容。

## 功能特性

- ✅ 用户认证（登录/注册）
- ✅ 文章管理（CRUD操作）
- ✅ 日记管理
- ✅ 留言板功能
- ✅ 评论系统
- ✅ 图片上传
- ✅ JWT身份验证
- ✅ 数据验证
- ✅ 错误处理
- ✅ 权限控制
- ✅ 分页查询
- ✅ 文件上传限制
- ✅ 安全中间件

## 技术栈

- **运行时**: Node.js (>= 16.0.0)
- **框架**: Express.js
- **数据库**: SQLite3
- **认证**: JWT (JSON Web Tokens)
- **安全**: Helmet, CORS, Rate Limiting
- **文件上传**: Multer
- **数据验证**: Joi
- **密码加密**: bcryptjs

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装步骤

1. **克隆项目**
   ```bash
   cd end
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   # 复制环境变量文件
   cp .env.example .env
   
   # 编辑环境变量（可选）
   # 修改 .env 文件中的配置
   ```

4. **初始化数据库**
   ```bash
   # 启动应用时会自动初始化数据库
   npm run dev
   ```

5. **启动服务**
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

### 默认账户

系统会自动创建默认管理员账户：
- **用户名**: admin
- **密码**: admin123

## API 接口文档

### 认证接口

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### 获取用户信息
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 文章接口

#### 获取文章列表
```http
GET /api/articles?page=1&limit=10&search=关键词
```

#### 获取文章详情
```http
GET /api/articles/:id
```

#### 创建文章
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容",
  "summary": "文章摘要",
  "labels": ["标签1", "标签2"]
}
```

#### 更新文章
```http
PUT /api/articles/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### 删除文章
```http
DELETE /api/articles/:id
Authorization: Bearer <token>
```

### 日记接口

#### 获取日记列表
```http
GET /api/diaries?page=1&limit=10
```

#### 创建日记
```http
POST /api/diaries
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "日记内容"
}
```

### 留言板接口

#### 获取留言列表
```http
GET /api/guestbook?page=1&limit=10
```

#### 提交留言
```http
POST /api/guestbook
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "留言内容",
  "parentId": "父级留言ID" // 可选，用于回复
}
```

### 上传接口

#### 单文件上传
```http
POST /api/upload/single
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <文件>
```

#### 多文件上传
```http
POST /api/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <文件数组>
```

## 项目结构

```
end/
├── config/                 # 配置文件
│   └── database.js        # 数据库配置
├── middleware/            # 中间件
│   ├── auth.js           # 认证中间件
│   └── validation.js     # 数据验证中间件
├── routes/               # 路由文件
│   ├── auth.js          # 认证路由
│   ├── articles.js      # 文章路由
│   ├── diaries.js       # 日记路由
│   ├── guestbook.js     # 留言板路由
│   └── upload.js        # 上传路由
├── scripts/             # 脚本文件
│   └── init-tables.js   # 数据库初始化脚本
├── uploads/             # 上传文件目录（自动创建）
├── database/            # 数据库文件目录（自动创建）
├── .env.example         # 环境变量示例
├── package.json         # 项目配置
├── app.js              # 应用入口
└── README.md           # 项目说明
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并修改相应配置：

```env
# 服务器配置
PORT=8081
NODE_ENV=development

# 数据库配置
DB_PATH=./database/blog.db

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# 跨域配置
ALLOWED_ORIGINS=http://localhost:4002
```

## 开发指南

### 添加新的API接口

1. 在 `routes/` 目录下创建新的路由文件
2. 在 `app.js` 中导入并注册路由
3. 添加相应的数据验证规则到 `middleware/validation.js`

### 数据库操作

使用 SQLite3 数据库，所有数据库操作都在 `config/database.js` 中配置。

### 错误处理

系统使用统一的错误响应格式：

```javascript
{
  "ec": "错误代码", // "0" 表示成功，"-1" 表示失败
  "em": "错误消息",
  "data": {} // 成功时返回的数据
}
```

## 部署说明

### 生产环境部署

1. **设置生产环境变量**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your_strong_secret_key
   ```

2. **安装生产依赖**
   ```bash
   npm install --production
   ```

3. **使用进程管理器**
   ```bash
   # 使用 pm2
   npm install -g pm2
   pm2 start app.js --name "blog-backend"
   ```

### Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
```

构建并运行：
```bash
docker build -t blog-backend .
docker run -p 8081:8081 blog-backend
```

## 常见问题

### Q: 数据库文件在哪里？
A: 数据库文件位于 `database/blog.db`，首次启动时自动创建。

### Q: 如何修改默认端口？
A: 修改 `.env` 文件中的 `PORT` 环境变量。

### Q: 上传的文件存储在哪里？
A: 上传的文件存储在 `uploads/` 目录下。

### Q: 如何重置数据库？
A: 删除 `database/blog.db` 文件，然后重启应用。

### Q: 如何修改文件大小限制？
A: 修改 `.env` 文件中的 `MAX_FILE_SIZE` 环境变量（单位：字节）。

## 许可证

MIT License

## 技术支持

如有问题，请提交 Issue 或联系开发团队。