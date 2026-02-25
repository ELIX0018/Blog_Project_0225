import { db } from '../config/database.js';

// 添加 link_email 字段到 links 表
const addLinkEmailColumn = () => {
  return new Promise((resolve, reject) => {
    // 先检查字段是否已存在
    db.all("PRAGMA table_info(links)", [], (err, rows) => {
      if (err) {
        console.error('获取表结构失败:', err.message);
        reject(err);
        return;
      }
      
      const hasLinkEmail = rows.some(row => row.name === 'link_email');
      
      if (hasLinkEmail) {
        console.log('✅ link_email 字段已存在');
        resolve();
        return;
      }
      
      // 添加字段
      db.run("ALTER TABLE links ADD COLUMN link_email TEXT", (err) => {
        if (err) {
          console.error('添加 link_email 字段失败:', err.message);
          reject(err);
        } else {
          console.log('✅ link_email 字段添加成功');
          resolve();
        }
      });
    });
  });
};

// 运行
addLinkEmailColumn()
  .then(() => {
    console.log('✅ 数据库更新完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 数据库更新失败:', error);
    process.exit(1);
  });
