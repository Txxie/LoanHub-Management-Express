import express, { Express, Request, Response, NextFunction } from 'express';
import { User } from '../model';
var router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, password } = req.body;
  try {
    // 查询数据库是否存在该用户
    const user = await User.findOne({ name, password });

    // 如果用户不存在，则返回相应提示信息
    if (!user) {
      return res.status(404).json({ message: '用户未注册' });
    }

    // 用户存在，则继续处理登录逻辑
    const data = user?.toJSON();
    delete data?.password;

    (req.session as any).user = user;

    return res.status(200).json({ data, success: true });
  } catch (error) {
    return res.status(500).json({ message: '账号密码错误' });
  }
});

export default router;
