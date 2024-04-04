import express, { Request, Response, NextFunction } from 'express';
import { Item } from '../model';
import { updateCategoryTotalQuantity } from '../utils/updateCategoryTotalQuantity';

var router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    console.log(
        '%c [ total ]-17',
        'font-size:13px; background:pink; color:#bf2c9f;',
        req
    );
    const itemModel = new Item(req.body);
    const item = await itemModel.save();
    // 更新分类总数函数
    await updateCategoryTotalQuantity();

    return res.status(200).json({ message: '创建成功' });
});

// 查询物品列表
router.get('/', async (req: Request, res: Response) => {
    const { current = 1, pageSize = 6, all, name, code, category } = req.query;
    /*原写法产生bug：在物品借用的物品名称下拉框，只会出现6条数据
    // 查询总数
    const total = await Item.countDocuments({
        ...(name && { name }),
        ...(code && { code }),
        ...(category && { category }),
    });
    console.log(
        '%c [ total ]-17',
        'font-size:13px; background:pink; color:#bf2c9f;',
        total
    );

    // 分页查询
    const data = await Item.find({
        ...(name && { name }),
        ...(code && { code }),
        ...(category && { category }),
    })
        .populate('category')
        .sort({ updatedAt: -1 })
        .skip((Number(current) - 1) * Number(pageSize))
        .limit(Number(pageSize));

    return res.status(200).json({ data, total });
    */
    // 如果参数 all 为 true，则返回所有数据
    if (all === 'true') {
        try {
            const data = await Item.find({
                ...(name && { name }),
                ...(code && { code }),
                ...(category && { category }),
            })
                .populate('category')
                .sort({ updatedAt: -1 });

            return res.status(200).json({ data, total: data.length });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // 否则，进行分页查询
    try {
        const total = await Item.countDocuments({
            ...(name && { name }),
            ...(code && { code }),
            ...(category && { category }),
        });

        console.log(
            '%c [ total ]-17',
            'font-size:13px; background:pink; color:#bf2c9f;',
            total
        );

        const data = await Item.find({
            ...(name && { name }),
            ...(code && { code }),
            ...(category && { category }),
        })
            .populate('category')
            .sort({ updatedAt: -1 })
            .skip((Number(current) - 1) * Number(pageSize))
            .limit(Number(pageSize));

        return res.status(200).json({ data, total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const item = await Item.findOne({ _id: req.params.id }).populate('category');
    if (item) {
        res.status(200).json({ data: item, success: true });
    } else {
        res.status(500).json({ message: '该书籍不存在' });
    }
});

// 更新一个物品
router.put('/:id', async (req: Request, res: Response) => {
    try {
        await Item.findOneAndUpdate({ _id: req.params.id }, req.body);
        // 更新分类总数函数
        await updateCategoryTotalQuantity();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({ error });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id);
    if (item) {
        await Item.deleteOne({ _id: req.params.id });
        // 更新分类总数函数
        await updateCategoryTotalQuantity();

        res.status(200).json({ success: true });
    } else {
        res.status(500).json({ message: '该书籍不存在' });
    }
});

export default router;
