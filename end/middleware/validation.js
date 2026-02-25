import Joi from 'joi';

// 用户注册验证
export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    userId: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      ec: '-1',
      em: error.details[0].message
    });
  }
  next();
};

// 用户登录验证
export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      ec: '-1',
      em: error.details[0].message
    });
  }
  next();
};

// 文章创建/更新验证
export const validateArticle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().min(1).required(),
    summary: Joi.string().max(500).optional(),
    labels: Joi.array().items(Joi.string()).optional(),
    status: Joi.number().valid(0, 1).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      ec: '-1',
      em: error.details[0].message
    });
  }
  next();
};

// 日记创建/更新验证
export const validateDiary = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      ec: '-1',
      em: error.details[0].message
    });
  }
  next();
};

// 留言/评论验证
export const validateComment = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(1000).required(),
    parentId: Joi.string().optional().allow(null, ''),
    articleId: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      ec: '-1',
      em: error.details[0].message
    });
  }
  next();
};

// 分页参数验证
export const validatePagination = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      ec: '-1',
      em: error.details[0].message
    });
  }
  
  // 将验证后的值设置回req.query
  req.query = schema.validate(req.query).value;
  next();
};