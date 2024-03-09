import mongoose from "mongoose";
import itemSchema from "./itemModel";
import borrowSchema from "./borrowModel";
import categorySchema from "./categoryModel";
import userSchema from "./userModel";
import { updateCategoryTotalQuantity } from '../utils/updateCategoryTotalQuantity';

async function main() {
  // await mongoose.connect("mongodb://localhost:27017/book-admin");
  await mongoose.connect("mongodb://root:root1190580010@ac-iiaslph-shard-00-00.xxpebcx.mongodb.net:27017,ac-iiaslph-shard-00-01.xxpebcx.mongodb.net:27017,ac-iiaslph-shard-00-02.xxpebcx.mongodb.net:27017/?ssl=true&replicaSet=atlas-t23suh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0");
}

main()
  .then((res) => {
    // 在数据库连接成功后调用更新分类总数函数
    updateCategoryTotalQuantity();
    console.log("mongo connected success");
  })
  .catch(() => {
    console.log("mongo connected fail");
  });

const Item = mongoose.model("Item", itemSchema);
const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Borrow = mongoose.model("Borrow", borrowSchema);

export { Borrow, Item, User, Category };
