import express from "express";
import { addCategory, categoryList } from "../controllers/CategoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.post("/add", addCategory);
CategoryRouter.get("/list", categoryList);

export default CategoryRouter;
