import express, { Request, Response } from 'express';
import { User } from '../model';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    console.log("进入注册接口");
    const { name, nickName, password } = req.body;
    try {
        // 查询数据库是否存在该用户名
        const existingUser = await User.findOne({ name });

        // 如果用户名已存在，则返回相应提示信息
        if (existingUser) {
            return res.status(400).json({ message: '用户名已被注册' });
        }

        // 创建新用户
        const newUser = new User({ name, nickName, password, role: 'user' });
        await newUser.save();

        // 返回新用户信息
        const data = newUser.toJSON();
        delete data.password;

        return res.status(201).json({ data, success: true, message: '注册成功' });
    } catch (error) {
        console.log("error222", error);
        return res.status(500).json({ message: '注册失败' });
    }
});

export default router;
