import express from "express";
import { addCategory, categoryList, getAllCategories, editCategory, deleteCategory } from "../controllers/CategoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.post("/add", addCategory);
CategoryRouter.get("/list", categoryList);
CategoryRouter.get("/all", getAllCategories);
CategoryRouter.put("/edit/:id", editCategory);
CategoryRouter.delete("/delete/:id", deleteCategory);

export default CategoryRouter;
