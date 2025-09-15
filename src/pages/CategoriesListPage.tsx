import { useEffect, useState, useCallback, useMemo } from "react";
import  { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

import api from "../api";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Thêm state cho lỗi

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parent: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Thêm state loading cho nút "Thêm"

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Thêm state loading cho nút "Lưu"
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    parent: "",
  });

  // Lấy danh mục
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get<{ data: { categories: Category[] } }>(`/categories`, {
        
      });
      setCategories(res.data.data.categories || []);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setErrorMsg("Không thể tải danh mục. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token, fetchCategories]);

  // Thêm danh mục
  const handleAdd = async () => {
    if (!newCategory.name.trim()) {
      setErrorMsg("Tên danh mục không được để trống.");
      return;
    }
    setErrorMsg(null);
    setIsAdding(true);
    try {
      await api.post(
        `/categories`,
        {
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
          parent: newCategory.parent || null,
        },
        {  }
      );
      setNewCategory({ name: "", description: "", parent: "" });
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi thêm:", err);
      const axiosErr = err as AxiosError<{ error: string }>;
      setErrorMsg(`Lỗi thêm danh mục: ${axiosErr.response?.data?.error || "Không rõ lỗi"}`);
    } finally {
      setIsAdding(false);
    }
  };

  // Xóa danh mục
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    setErrorMsg(null);
    try {
      await api.delete(`/categories/${id}`, {
        
      });
      fetchCategories();
    } catch (err) {
      console.error("Lỗi xóa:", err);
      const axiosErr = err as AxiosError<{ error: string }>;
      setErrorMsg(`Lỗi xóa danh mục: ${axiosErr.response?.data?.error || "Không rõ lỗi"}`);
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
    if (!editValues.name.trim()) {
        setErrorMsg("Tên danh mục không được để trống.");
        return;
    }
    setErrorMsg(null);
    setIsSaving(true);
    try {
      await api.put(
        `/categories/${id}`,
        {
          name: editValues.name.trim(),
          description: editValues.description.trim(),
          parent: editValues.parent || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi sửa:", err);
      const axiosErr = err as AxiosError<{ error: string }>;
      setErrorMsg(`Lỗi cập nhật danh mục: ${axiosErr.response?.data?.error || "Không rõ lỗi"}`);
    } finally {
        setIsSaving(false);
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

  // Danh mục sau khi lọc và sắp xếp
  const filtered = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return categories
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          (c.description || "").toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, search]);

  // Các danh mục hợp lệ để làm cha khi chỉnh sửa
  const validParentCategories = useMemo(() => {
    return categories.filter(p => {
        // Không thể chọn chính nó hoặc hậu duệ của nó làm danh mục cha
        const isEditingDescendant = editingId ? getDescendants(editingId).includes(p._id) : false;
        return p._id !== editingId && !isEditingDescendant;
    });
  }, [categories, editingId, getDescendants]);
  
  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý danh mục sách</h1>

        {errorMsg && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">{errorMsg}</div>}

        {/* Nút hiển thị form thêm */}
        {!showAddForm ? (
          <button
            onClick={() => {
              setShowAddForm(true);
              setErrorMsg(null);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 mb-4"
          >
            <FiPlus /> Thêm danh mục
          </button>
        ) : (
          <div className="border rounded p-4 mb-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">Thêm danh mục mới</h2>
            <div className="flex flex-col md:flex-row gap-2 mb-3">
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
                className={`px-4 py-2 rounded flex items-center gap-1 ${isAdding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                disabled={isAdding}
              >
                <FiSave /> {isAdding ? "Đang thêm..." : "Lưu"}
              </button>
              <button
                onClick={() => {
                    setShowAddForm(false);
                    setErrorMsg(null);
                }}
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
            className="border p-2 rounded w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Danh sách danh mục */}
        {loading ? (
          <p>Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Không tìm thấy danh mục nào.</p>
        ) : (
          <table className="w-full border table-fixed">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border w-1/4">Tên</th>
                <th className="p-2 border w-1/4">Mô tả</th>
                <th className="p-2 border w-1/4">Danh mục cha</th>
                <th className="p-2 border w-1/4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td className="p-2 border overflow-hidden text-ellipsis">
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
                  <td className="p-2 border overflow-hidden text-ellipsis">
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
                        {validParentCategories.map((p) => (
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
                          className={`text-blue-600 flex items-center gap-1 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleSave(c._id)}
                          disabled={isSaving}
                        >
                          <FiSave /> {isSaving ? "Lưu..." : "Lưu"}
                        </button>
                        <button
                          className="text-gray-600 flex items-center gap-1"
                          onClick={() => {
                            setEditingId(null);
                            setErrorMsg(null);
                          }}
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