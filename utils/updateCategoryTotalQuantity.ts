// 引入必要的模块
import mongoose from 'mongoose';
import { Category } from '../model';
// import Category from '../model'; // 假设你有一个分类模型

// 计算并更新分类表中的总数字段
export async function updateCategoryTotalQuantity() {
    try {
        // 使用聚合管道进行计算
        const aggregateResult = await mongoose.model('Item').aggregate([
            {
                $group: {
                    _id: '$category', // 按分类分组
                    totalStock: { $sum: '$stock' } // 计算每个分类下的库存总和
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    totalStock: 1
                }
            }
        ]);

        // 更新分类表中的总数字段
        for (const result of aggregateResult) {
            await Category.findByIdAndUpdate(result.category, { quantity: result.totalStock });
        }

        console.log('分类总数已成功更新');
    } catch (error) {
        console.error('更新分类总数时出错：', error);
    }
}

