import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Categories = () => {
  const { axios } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");

    try {
      const { data } = await axios.post("/api/category/add", {
        name,
        description,
      });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleAddCategory} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Vegetables"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description (optional)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Brief description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default Categories;
