import { db } from '../config/database.js';

// 创建点赞表
const createLikeTables = () => {
  return new Promise((resolve, reject) => {
    // 文章点赞表
    const createArticleLikesTable = `
      CREATE TABLE IF NOT EXISTS article_likes (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(article_id, user_id)
      )
    `;

    // 评论点赞表
    const createCommentLikesTable = `
      CREATE TABLE IF NOT EXISTS comment_likes (
        id TEXT PRIMARY KEY,
        comment_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comment_id) REFERENCES comments (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(comment_id, user_id)
      )
    `;

    const tables = [
      createArticleLikesTable,
      createCommentLikesTable
    ];

    let completed = 0;
    
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`创建点赞表 ${index + 1} 失败:`, err.message);
          reject(err);
        } else {
          completed++;
          console.log(`✅ 点赞表 ${index + 1} 创建成功`);
          
          if (completed === tables.length) {
            resolve();
          }
        }
      });
    });
  });
};

// 运行初始化
createLikeTables()
  .then(() => {
    console.log('✅ 所有表初始化完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 表初始化失败:', error);
    process.exit(1);
  });