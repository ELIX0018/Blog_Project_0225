import bcrypt from 'bcryptjs';

// 生成 admin123 的密码哈希
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('生成密码哈希失败:', err);
    return;
  }
  
  console.log('密码:', password);
  console.log('哈希值:', hash);
  
  // 验证哈希是否正确
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('验证失败:', err);
      return;
    }
    console.log('验证结果:', result);
  });
});