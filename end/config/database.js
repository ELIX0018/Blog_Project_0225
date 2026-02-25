import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'blog.db');

// 创建数据库连接
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('✅ 数据库连接成功');
  }
});

// 初始化数据库表
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // 用户表
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        user_head TEXT DEFAULT 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
        user_power_id INTEGER DEFAULT 1,
        qq_id TEXT,
        qq_name TEXT,
        qq_img TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 文章表
    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        labels TEXT, -- JSON格式存储标签数组
        user_id TEXT NOT NULL,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        status INTEGER DEFAULT 1, -- 1: 发布, 0: 草稿
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    // 日记表
    const createDiariesTable = `
      CREATE TABLE IF NOT EXISTS diaries (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    // 留言表
    const createGuestbookTable = `
      CREATE TABLE IF NOT EXISTS guestbook (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        parent_id TEXT DEFAULT NULL, -- 回复的留言ID
        user_id TEXT NOT NULL,
        address TEXT DEFAULT '未知',
        likes INTEGER DEFAULT 0,
        content_img TEXT, -- 图片URL，逗号分隔
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (parent_id) REFERENCES guestbook (id)
      )
    `;

    // 评论表（文章评论）
    const createCommentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL,
        content TEXT NOT NULL,
        parent_id TEXT DEFAULT NULL,
        user_id TEXT NOT NULL,
        address TEXT DEFAULT '未知',
        likes INTEGER DEFAULT 0,
        content_img TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (parent_id) REFERENCES comments (id)
      )
    `;

    // 友链表
    const createLinksTable = `
      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        link_name TEXT NOT NULL,
        link_link TEXT NOT NULL,
        link_icon TEXT,
        link_describe TEXT,
        email TEXT,
        status INTEGER DEFAULT 1, -- 1: 已通过, 0: 待审核
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const tables = [
      createUsersTable,
      createArticlesTable,
      createDiariesTable,
      createGuestbookTable,
      createCommentsTable,
      createLinksTable
    ];

    let completed = 0;
    
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`创建表 ${index + 1} 失败:`, err.message);
          reject(err);
        } else {
          completed++;
          console.log(`✅ 表 ${index + 1} 创建成功`);
          
          if (completed === tables.length) {
            // 插入默认管理员用户
            const defaultUser = {
              id: 'apple1704348343094',
              username: 'admin',
              email: 'admin@example.com',
              password: '$2a$10$nFgr38pAxE1DyA5jojlf7.uY1tvMewegyZ/d/QQyD2k3YhKaaZk.W', // 密码: admin123
              user_head: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
              user_power_id: 999
            };

            const insertUserSql = `
              INSERT OR IGNORE INTO users (id, username, email, password, user_head, user_power_id)
              VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(insertUserSql, [
              defaultUser.id,
              defaultUser.username,
              defaultUser.email,
              defaultUser.password,
              defaultUser.user_head,
              defaultUser.user_power_id
            ], (err) => {
              if (err) {
                console.error('插入默认用户失败:', err.message);
              } else {
                console.log('✅ 默认用户创建成功 (用户名: admin, 密码: admin123)');
                
                // 添加示例日记数据
                const sampleDiaries = [
                  {
                    id: 'diary_' + Date.now(),
                    content: '# 欢迎来到我的博客！\n\n这是我的第一篇随笔，记录一些日常的思考和感悟。\n\n**技术栈：**\n- Vue 3 + TypeScript\n- Naive UI\n- Node.js + Express\n- SQLite\n\n希望这个博客能成为我记录成长的地方！',
                    user_id: defaultUser.id
                  },
                  {
                    id: 'diary_' + (Date.now() + 1),
                    content: '## 今日学习总结\n\n今天学习了Vue 3的组合式API，感觉比选项式API更加灵活。\n\n**主要收获：**\n- setup函数的使用\n- 响应式系统的改进\n- Composition API的优势\n\n继续加油！💪',
                    user_id: defaultUser.id
                  },
                  {
                    id: 'diary_' + (Date.now() + 2),
                    content: '### 项目进展\n\n博客系统基本功能已经完成：\n- ✅ 文章管理\n- ✅ 留言板\n- ✅ 随笔功能\n- ✅ 用户认证\n\n接下来需要完善：\n- 文章分类\n- 搜索功能\n- 主题切换\n\n一步步来，不急不躁。',
                    user_id: defaultUser.id
                  }
                ];
                
                const insertDiarySql = 'INSERT OR IGNORE INTO diaries (id, content, user_id) VALUES (?, ?, ?)';
                let diariesInserted = 0;
                
                sampleDiaries.forEach((diary) => {
                  db.run(insertDiarySql, [diary.id, diary.content, diary.user_id], (err) => {
                    if (err) {
                      console.error('插入示例日记失败:', err.message);
                    } else {
                      diariesInserted++;
                      if (diariesInserted === sampleDiaries.length) {
                        console.log(`✅ 成功添加 ${diariesInserted} 条示例日记`);
                        
                        // 添加示例友链数据
                        const sampleLinks = [
                          {
                            id: 'link_apple_blog',
                            link_name: '张苹果博客',
                            link_link: 'https://www.zhangpingguo.com/',
                            link_icon: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
                            link_describe: '一个分享技术和生活的个人博客',
                            status: 1
                          },
                          {
                            id: 'link_vuejs_org',
                            link_name: 'Vue.js官网',
                            link_link: 'https://vuejs.org/',
                            link_icon: 'https://vuejs.org/images/logo.png',
                            link_describe: '渐进式JavaScript框架',
                            status: 1
                          },
                          {
                            id: 'link_nodejs_org',
                            link_name: 'Node.js官网',
                            link_link: 'https://nodejs.org/',
                            link_icon: 'https://nodejs.org/static/images/logo.svg',
                            link_describe: '基于Chrome V8引擎的JavaScript运行时',
                            status: 1
                          }
                        ];
                        
                        const insertLinkSql = 'INSERT OR IGNORE INTO links (id, link_name, link_link, link_icon, link_describe, status) VALUES (?, ?, ?, ?, ?, ?)';
                        let linksInserted = 0;
                        
                        sampleLinks.forEach((link) => {
                          db.run(insertLinkSql, [link.id, link.link_name, link.link_link, link.link_icon, link.link_describe, link.status], (err) => {
                            if (err) {
                              console.error('插入示例友链失败:', err.message);
                            } else {
                              linksInserted++;
                              if (linksInserted === sampleLinks.length) {
                                console.log(`✅ 成功添加 ${linksInserted} 条示例友链`);
                              }
                            }
                          });
                        });
                      }
                    }
                  });
                });
              }
              resolve();
            });
          }
        }
      });
    });
  });
};