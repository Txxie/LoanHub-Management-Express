import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, //必填
    },
    code: {
        type: String,
        // type: Number,
        required: true,
    },
    itemLocation: {
        type: String,
    },
    cover: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // 外联，连到分类表
        ref: 'Category',
    },
    stock: {
        type: Number,
        default: 0,
    },
    publishAt: {
        type: Number,
        default: null,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
    updatedAt: {
        type: Number,
        default: Date.now(),
    },
});

export default itemSchema;
