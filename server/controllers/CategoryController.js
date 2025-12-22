import Category from "../models/Category.js";

// ✅ Add Category: /api/category/add
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exist = await Category.findOne({ name });
    if (exist) {
      return res.json({ success: false, message: "Category already exists" });
    }
    await Category.create({ name, description });
    res.json({ success: true, message: "Category Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ List Categories: /api/category/list
export const categoryList = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Edit Category: /api/category/edit/:id
export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // Check if new name already exists (excluding current category)
    if (name !== category.name) {
      const exist = await Category.findOne({ name });
      if (exist) {
        return res.json({ success: false, message: "Category name already exists" });
      }
    }

    category.name = name;
    category.description = description;
    await category.save();

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete Category: /api/category/delete/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};