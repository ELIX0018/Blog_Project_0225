import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Sqlite3 = sqlite3.verbose();

const dbPath = path.join(__dirname, '..', 'database', 'blog.db');
const db = new Sqlite3.Database(dbPath);

db.serialize(() => {
  db.get("PRAGMA table_info(links)", (err, row) => {
    if (err) {
      console.error('查询表结构失败:', err.message);
      db.close();
      return;
    }
  });

  db.all("PRAGMA table_info(links)", (err, columns) => {
    if (err) {
      console.error('查询表结构失败:', err.message);
      db.close();
      return;
    }

    const hasEmail = columns.some(col => col.name === 'email');
    const hasStatus = columns.some(col => col.name === 'status');

    const migrations = [];

    if (!hasEmail) {
      migrations.push('ALTER TABLE links ADD COLUMN email TEXT');
      console.log('准备添加 email 字段');
    } else {
      console.log('email 字段已存在');
    }

    if (!hasStatus) {
      migrations.push('ALTER TABLE links ADD COLUMN status INTEGER DEFAULT 1');
      console.log('准备添加 status 字段');
    } else {
      console.log('status 字段已存在');
    }

    if (migrations.length > 0) {
      migrations.forEach(sql => {
        db.run(sql, (err) => {
          if (err) {
            console.error(`执行失败 [${sql}]:`, err.message);
          } else {
            console.log(`执行成功: ${sql}`);
          }
        });
      });

      db.run('UPDATE links SET status = 1 WHERE status IS NULL', (err) => {
        if (err) {
          console.error('更新现有数据状态失败:', err.message);
        } else {
          console.log('已将现有友链设置为已通过状态');
        }
      });
    }

    console.log('数据库迁移完成');
    db.close();
  });
});