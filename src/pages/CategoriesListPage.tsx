import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Category {
  _id: string;
  name: string;
  description: string;
  parent?: { _id: string; name: string } | null;
}

export default function CategoriesListPage() {
  const { user, loading: authLoading, token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parent: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    parent: "",
  });

  // Lấy danh mục
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data.categories || []);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Thêm danh mục
  const handleAdd = async () => {
    if (!newCategory.name) return;
    try {
      await axios.post(
        `${API_BASE}/categories`,
        {
          name: newCategory.name,
          description: newCategory.description,
          parent: newCategory.parent || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory({ name: "", description: "", parent: "" });
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi thêm:", err);
    }
  };

  // Xóa danh mục
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await axios.delete(`${API_BASE}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  // Bắt đầu sửa
  const handleEdit = (c: Category) => {
    setEditingId(c._id);
    setEditValues({
      name: c.name,
      description: c.description || "",
      parent: c.parent?._id || "",
    });
  };

  // Lưu sửa
  const handleSave = async (id: string) => {
    try {
      await axios.put(
        `${API_BASE}/categories/${id}`,
        {
          name: editValues.name,
          description: editValues.description,
          parent: editValues.parent || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi sửa:", err);
    }
  };

  // Hàm đệ quy để lấy tất cả các hậu duệ của một danh mục
  const getDescendants = useCallback((categoryId: string): string[] => {
    const descendants: string[] = [];
    const findChildren = (parentId: string) => {
      categories.forEach((cat) => {
        if (cat.parent?._id === parentId) {
          descendants.push(cat._id);
          findChildren(cat._id); // Đệ quy
        }
      });
    };
    findChildren(categoryId);
    return descendants;
  }, [categories]);

  // Danh mục sau khi lọc (theo tên hoặc mô tả)
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý danh mục sách</h1>

        {/* Nút hiển thị form thêm */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 mb-4"
          >
            <FiPlus /> Thêm danh mục
          </button>
        ) : (
          <div className="border rounded p-4 mb-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">Thêm danh mục mới</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Tên danh mục"
                className="border p-2 rounded flex-1"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Mô tả"
                className="border p-2 rounded flex-1"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
              <select
                className="border p-2 rounded flex-1"
                value={newCategory.parent}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, parent: e.target.value })
                }
              >
                <option value="">-- Không có danh mục cha --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <FiSave /> Lưu
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded flex items-center gap-1"
              >
                <FiX /> Hủy
              </button>
            </div>
          </div>
        )}

        {/* Tìm kiếm (theo tên + mô tả) */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            className="border p-2 rounded w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Danh sách danh mục */}
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Mô tả</th>
                <th className="p-2 border">Danh mục cha</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td className="p-2 border">
                    {editingId === c._id ? (
                      <input
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            name: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="p-2 border">
                    {editingId === c._id ? (
                      <input
                        value={editValues.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      c.description
                    )}
                  </td>
                  <td className="p-2 border">
                    {editingId === c._id ? (
                      <select
                        className="border p-1 rounded w-full"
                        value={editValues.parent}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            parent: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Không có danh mục cha --</option>
                        {categories
                          .filter((p) => p._id !== c._id && !getDescendants(c._id).includes(p._id))
                          .map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      c.parent?.name || "-"
                    )}
                  </td>
                  <td className="p-2 border flex gap-2">
                    {editingId === c._id ? (
                      <>
                        <button
                          className="text-blue-600 flex items-center gap-1"
                          onClick={() => handleSave(c._id)}
                        >
                          <FiSave /> Lưu
                        </button>
                        <button
                          className="text-gray-600 flex items-center gap-1"
                          onClick={() => setEditingId(null)}
                        >
                          <FiX /> Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-green-600 flex items-center gap-1"
                          onClick={() => handleEdit(c)}
                        >
                          <FiEdit2 /> Sửa
                        </button>
                        <button
                          className="text-red-600 flex items-center gap-1"
                          onClick={() => handleDelete(c._id)}
                        >
                          <FiTrash2 /> Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SidebarLayout>
  );
}