import express, { Express, Request, Response, NextFunction } from 'express';
import { User } from '../model';
var router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, password } = req.body;
  try {
    // 查询数据库是否存在该用户
    const user = await User.findOne({ name });

    // 如果用户不存在，则返回相应提示信息
    if (!user) {
      return res.status(404).json({ message: '用户未注册' });
    }

    // 如果用户存在，则进行密码校验
    if (user.password !== password) {
      return res.status(500).json({ message: '密码错误' });
    }

    // 密码校验通过，则登录成功
    const userData = user.toJSON();
    delete userData.password;

    (req.session as any).user = userData;

    return res.status(200).json({ data: userData, success: true });
  } catch (error) {
    return res.status(500).json({ message: '服务器内部错误' });
  }
});


export default router;
