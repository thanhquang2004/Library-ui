import { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaSync } from "react-icons/fa";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Virtuoso } from "react-virtuoso";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Author {
  authorId: string;
  name: string;
  description?: string;
  birthDate?: string;
  nationality?: string;
  books?: string[];
}

export default function AuthorManagementPage() {
  const { token, user, loading: authLoading } = useAuth();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [showModal, setShowModal] = useState<"create" | "edit" | "view" | null>(null);
  const [formData, setFormData] = useState<Partial<Author>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("vi-VN");
  };

  const loadData = useCallback(async (searchName: string = "") => {
    if (!token) return;
    setLoading(true);
    try {
      const trimmedQuery = searchName.trim();
      let url = `${API_BASE}/author`; // 🔹 Đã sửa để khớp với backend
      let params = {};

      if (trimmedQuery.length > 0) {
        url = `${API_BASE}/author/search`; // 🔹 Đây là API riêng nên không sửa
        params = { name: trimmedQuery };
      }

      const res = await axios.get<Author[]>(url, {
        headers: authHeader,
        params,
      });
      setAuthors(res.data);
    } catch (err) {
      console.error("Lỗi khi tải tác giả:", err);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }, [token, authHeader]);

  useEffect(() => {
    if (token && !authLoading) {
      const timer = setTimeout(() => {
        loadData(query);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token, authLoading, query, loadData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa tác giả này?")) return;
    try {
      await axios.delete(`${API_BASE}/author/${id}`, { // 🔹 Đã sửa để khớp với backend
        headers: authHeader,
      });
      setAuthors((prev) => prev.filter((a) => a.authorId !== id));
    } catch (err) {
      console.error("Lỗi khi xóa tác giả", err);
      alert("Xóa thất bại");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setErrorMsg("Tên tác giả là bắt buộc");
      return;
    }

    setErrorMsg(null);
    setLoadingSubmit(true);

    try {
      const payload: Partial<Author> = {
        name: formData.name,
        description: formData.description,
        birthDate: formData.birthDate,
        nationality: formData.nationality,
      };

      if (showModal === "create") {
        await axios.post(`${API_BASE}/author`, payload, { // 🔹 Đã sửa để khớp với backend
          headers: authHeader,
        });
      } else if (showModal === "edit" && selectedAuthor) {
        await axios.put(
          `${API_BASE}/author/${selectedAuthor.authorId}`, // 🔹 Đã sửa để khớp với backend
          payload,
          { headers: authHeader }
        );
      }

      setShowModal(null);
      setFormData({});
      loadData(query);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      if (axiosErr.response?.data?.error)
        setErrorMsg(`Server: ${axiosErr.response.data.error}`);
      else setErrorMsg("Lỗi khi lưu tác giả");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý tác giả</h1>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên tác giả..."
            className="border rounded p-2 flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => loadData(query)}
          >
            <FaSearch />
          </button>
          <button
            className="p-2 bg-gray-300 rounded text-gray-800"
            onClick={() => {
              setQuery("");
              loadData("");
            }}
            title="Làm mới"
          >
            <FaSync />
          </button>
          {(user?.role === "admin" || user?.role === "librarian") && (
            <button
              className="flex items-center gap-2 p-2 bg-green-500 text-white rounded"
              onClick={() => {
                setShowModal("create");
                setFormData({});
              }}
            >
              <FaPlus /> Thêm tác giả
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 bg-gray-100 border-b font-semibold">
          <div className="p-2">Tên</div>
          <div className="p-2">Quốc tịch</div>
          <div className="p-2">Ngày sinh</div>
          <div className="p-2">Mô tả</div>
          <div className="p-2">Hành động</div>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : authors.length === 0 ? (
          <p className="text-gray-500 mt-4">Không có tác giả nào</p>
        ) : (
          <Virtuoso
            style={{ height: 500 }}
            totalCount={authors.length}
            itemContent={(index) => {
              const a = authors[index];
              return (
                <div className="grid grid-cols-5 border-b items-center text-sm">
                  <div className="p-2">{a.name}</div>
                  <div className="p-2">{a.nationality || "-"}</div>
                  <div className="p-2">{formatDate(a.birthDate)}</div>
                  <div className="p-2 truncate">{a.description || "-"}</div>
                  <div className="p-2 flex gap-2">
                    <button
                      className="p-1 bg-blue-500 text-white rounded"
                      onClick={() => {
                        setSelectedAuthor(a);
                        setShowModal("view");
                      }}
                    >
                      <FaEye />
                    </button>
                    {(user?.role === "admin" || user?.role === "librarian") && (
                      <>
                        <button
                          className="p-1 bg-yellow-500 text-white rounded"
                          onClick={() => {
                            setSelectedAuthor(a);
                            setFormData({ ...a });
                            setShowModal("edit");
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-1 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(a.authorId)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }}
          />
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-lg overflow-auto max-h-[90vh]">
              {showModal === "view" && selectedAuthor && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {selectedAuthor.name}
                  </h2>
                  <p>
                    <strong>Ngày sinh:</strong> {formatDate(selectedAuthor.birthDate)}
                  </p>
                  <p>
                    <strong>Quốc tịch:</strong> {selectedAuthor.nationality || "-"}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {selectedAuthor.description || "-"}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => setShowModal(null)}
                  >
                    Đóng
                  </button>
                </div>
              )}

              {(showModal === "create" || showModal === "edit") && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {showModal === "create" ? "Thêm tác giả" : "Cập nhật tác giả"}
                  </h2>
                  {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                  <div className="space-y-3">
                    <label className="block font-semibold">Tên tác giả</label>
                    <input
                      type="text"
                      placeholder="Nhập tên tác giả"
                      className="border rounded p-2 w-full"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <label className="block font-semibold">Ngày sinh</label>
                    <input
                      type="date"
                      className="border rounded p-2 w-full"
                      value={formData.birthDate || ""}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />

                    <label className="block font-semibold">Quốc tịch</label>
                    <input
                      type="text"
                      placeholder="Nhập quốc tịch"
                      className="border rounded p-2 w-full"
                      value={formData.nationality || ""}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />

                    <label className="block font-semibold">Mô tả</label>
                    <textarea
                      placeholder="Nhập mô tả"
                      className="border rounded p-2 w-full"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                      onClick={() => setShowModal(null)}
                    >
                      Hủy
                    </button>
                    <button
                      className={`px-4 py-2 text-white rounded ${loadingSubmit ? "bg-gray-400" : "bg-blue-500"}`}
                      onClick={handleSubmit}
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}