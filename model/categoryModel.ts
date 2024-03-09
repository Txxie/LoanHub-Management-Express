import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    // type: Number,
    type: String,
    required: true,
  },
  quantity: { //总数
    type: Number,
    default: 0,
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  updatedAt: {
    type: Number,
    default: Date.now(),
  },
});

export default categorySchema;
