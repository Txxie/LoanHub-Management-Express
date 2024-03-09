import express, { Request, Response, NextFunction } from 'express';
import { Item, Borrow, User } from '../model';

var router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { current, pageSize, item, user, status } = req.query;
  const total = await Borrow.countDocuments({
    ...(item && { item }),
    ...(user && { user }),
    ...(status && { status }),
  });
  // 如果用户是普通用户，则只返回自己的借阅，若是管理员返回所有的
  const session = req.session as any;
  let newUser = user;
  if (session.user && session.user.role === 'user') {
    newUser = session.user._id;
  }
  const data = await Borrow.find({
    ...(item && { item }),
    ...(newUser && { user: newUser }),
    ...(status && { status }),
  })
    .sort({ updatedAt: -1 })
    .skip((Number(current) - 1) * Number(pageSize))
    .populate(['user', 'item']);

  res.status(200).json({ message: true, data, total });
});

// 租借添加
router.post('/', async (req: Request, res: Response) => {
  const { item, user } = req.body;
  const borrow = new Borrow(req.body);

  const itemData = await Item.findOne({ _id: item });

  if (itemData) {
    // 若库存大于1，则可以借阅
    if (itemData.stock > 0) {
      await borrow.save();
      // 保存成功后库存减少1
      await Item.findByIdAndUpdate(itemData._id, { stock: itemData.stock - 1 });
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: '书籍库存不足' });
    }
  } else {
    res.status(500).json({ message: '书籍不存在' });
  }

  const obj = await borrow.save();
  res.status(200).json({ message: true });
});

router.get('/:id', async (req: Request, res: Response) => {
  const data = await Borrow.findOne({ _id: req.params.id });
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(500).json({ message: '该借阅不存在' });
  }
});

// 对应租借编辑
router.put('/:id', async (req: Request, res: Response) => {
  console.log(
    '%c [ total ]-17',
    'font-size:13px; background:pink; color:#bf2c9f;',
    req.params.id
  );
  try {
    await Borrow.findOneAndUpdate({ _id: req.params.id }, req.body);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const borrow = await Borrow.findById(req.params.id);
  if (borrow) {
    await Borrow.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ message: '该借阅不存在' });
  }
});

// 物品归还
router.put('/back/:id', async (req: Request, res: Response) => {
  const borrow = await Borrow.findOne({ _id: req.params.id });
  if (borrow) {
    if (borrow.status === 'off') {
      res.status(500).json({ message: '当前书籍已被还' });
    } else {
      borrow.status = 'off';
      borrow.backAt = Date.now();
      await borrow.save();
      // 书籍归还后需要更新书的库存
      const item = await Item.findOne({ _id: borrow.item });

      if (item) {
        item.stock += 1;
        await item.save();
      } else {
        res.status(500).json({ message: '书籍不存在' });
      }

      // 书籍归还后，把库存增加一个
      res.status(200).json({ success: true });
    }
  } else {
    res.status(500).json({ message: '该借阅不存在' });
  }
});

// 返回所有的item和表中相同item的总条数 用不上，直接用上面写的router.get('/', ...)
// router.get('/', async (req: Request, res: Response) => {
//   const data = await Borrow.find();
//   console.log(
//     '%c [ data ]-17',
//     'font-size:13px; background:pink; color:#bf2c9f;',
//     data
//   );
//   if (data) {
//     res.status(200).json({ success: true, data });
//   } else {
//     res.status(500).json({ message: '无借出数据' });
//   }
// });

export default router;
