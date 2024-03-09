import express, { Request, Response, NextFunction } from "express";
import { Category } from "../model";

var router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { name, level, all, pageSize, current } = req.query;
  /*原写法产生bug,c创建分类时选择二级分类出现所属分类的下拉框时，不能返回所有一级分类的名称
  const total = await Category.countDocuments(req.body);

  const data = await Category.find({
    ...(name && { name }),
    ...(level && { level }),
  })
    .skip((Number(current) - 1) * Number(pageSize))
    .sort({ updatedAt: -1 })
    .populate("parent");
  return res.status(200).json({ data, success: true, total });
  */

  if (all === 'true') {
    try {
      const data = await Category.find({
        ...(name && { name }),
        ...(level && { level }),
      })
        .sort({ updatedAt: -1 })
        .populate("parent");
      return res.status(200).json({ data, total: data.length });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  try {
    const total = await Category.countDocuments({
      ...(name && { name }),
      ...(level && { level }),
    });
    const data = await Category.find({
      ...(name && { name }),
      ...(level && { level }),
    })
      .skip((Number(current) - 1) * Number(pageSize))
      .sort({ updatedAt: -1 })
      .populate("parent");
    return res.status(200).json({ data, success: true, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = new Category(req.body);

  const oldCategory = await Category.findOne({ name });

  if (!oldCategory) {
    await category.save();
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ message: "分类已存在" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({
      _id: req.params.id,
    });
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ message: "分类不存在" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body);

  if (category) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ message: "该分类不存在" });
  }
});

// GET /api/categories
// 返回分类表中的各分类名称和总数
router.get('/api/categories', async (req: Request, res: Response) => {
  try {
    // 从数据库中获取每个分类的名称和总数
    const categories = await Category.find({}, 'name quantity');

    // 返回结果给前端
    res.status(200).json(categories);
  } catch (error) {
    console.error('获取分类信息时出错：', error);
    res.status(500).json({ message: '获取分类信息时出错' });
  }
});

export default router;
