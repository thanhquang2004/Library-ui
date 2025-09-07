import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Virtuoso } from "react-virtuoso";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Rack {
  _id: string;
  code: string;
  location?: string;
  capacity: number;
  isDeleted?: boolean;
}

interface RackResponse {
  success: boolean;
  data: {
    racks: Rack[];
    total: number;
    page: number;
    limit: number;
  };
}

export default function RackManagementPage() {
  const { token, user, loading: authLoading } = useAuth();

  const [racks, setRacks] = useState<Rack[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [showModal, setShowModal] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Rack>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🔹 Hàm load dữ liệu từ backend
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get<RackResponse>(`${API_BASE}/racks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = res.data.data;
      if (result && Array.isArray(result.racks)) {
        setRacks(result.racks);
      } else {
        setRacks([]);
      }
    } catch (err) {
      console.error("Error loading racks:", err);
      setRacks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🔹 Gọi API khi load trang
  useEffect(() => {
    if (!token || authLoading) return;
    loadData();
  }, [token, authLoading, loadData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa kệ sách này?")) return;
    try {
      await axios.delete(`${API_BASE}/racks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error("Error deleting rack", err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.capacity) {
      setErrorMsg("Mã kệ và sức chứa là bắt buộc");
      return;
    }

    setErrorMsg(null);
    setLoadingSubmit(true);

    try {
      const payload: Partial<Rack> = {
        code: formData.code,
        location: formData.location,
        capacity: formData.capacity,
      };

      if (showModal === "create") {
        await axios.post(`${API_BASE}/racks`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (showModal === "edit" && selectedRack) {
        await axios.put(`${API_BASE}/racks/${selectedRack._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowModal(null);
      setFormData({});
      loadData();
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      if (axiosErr.response?.data?.error)
        setErrorMsg(`Server: ${axiosErr.response.data.error}`);
      else setErrorMsg("Lỗi khi lưu kệ sách");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 🔹 Filter theo code
  const filteredRacks =
    query.trim().length >= 1
      ? racks.filter((r) =>
          r.code.toLowerCase().includes(query.trim().toLowerCase())
        )
      : racks;

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý kệ sách</h1>

        {/* Search + Add */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Tìm theo mã kệ..."
            className="border rounded p-2 flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => loadData()}
          >
            <FaSearch />
          </button>
          {(user?.role === "admin" || user?.role === "librarian") && (
            <button
              className="flex items-center gap-2 p-2 bg-green-500 text-white rounded"
              onClick={() => {
                setShowModal("create");
                setFormData({});
              }}
            >
              <FaPlus /> Thêm kệ
            </button>
          )}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-4 bg-gray-100 border-b font-semibold">
          <div className="p-2">Mã kệ</div>
          <div className="p-2">Vị trí</div>
          <div className="p-2">Sức chứa</div>
          <div className="p-2">Hành động</div>
        </div>

        {/* List */}
        {loading ? (
          <p>Đang tải...</p>
        ) : filteredRacks.length === 0 ? (
          <p className="text-gray-500 mt-4">Không có kệ sách nào</p>
        ) : (
          <Virtuoso
            style={{ height: 500 }}
            totalCount={filteredRacks.length}
            itemContent={(index) => {
              const r = filteredRacks[index];
              return (
                <div className="grid grid-cols-4 border-b items-center text-sm">
                  <div className="p-2">{r.code}</div>
                  <div className="p-2">{r.location || "-"}</div>
                  <div className="p-2">{r.capacity}</div>
                  <div className="p-2 flex gap-2">
                    <button
                      className="p-1 bg-blue-500 text-white rounded"
                      onClick={() => {
                        setSelectedRack(r);
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
                            setSelectedRack(r);
                            setFormData({ ...r });
                            setShowModal("edit");
                          }}
                        >
                          <FaEdit />
                        </button>
                         {user?.role === "admin" && (
                        <button
                          className="p-1 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(r._id)}
                        >
                          <FaTrash />
                        </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            }}
          />
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-lg overflow-auto max-h-[90vh]">
              {/* View */}
              {showModal === "view" && selectedRack && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Kệ: {selectedRack.code}
                  </h2>
                  <p>
                    <strong>Vị trí:</strong> {selectedRack.location || "-"}
                  </p>
                  <p>
                    <strong>Sức chứa:</strong> {selectedRack.capacity}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => setShowModal(null)}
                  >
                    Đóng
                  </button>
                </div>
              )}

              {/* Create / Edit */}
              {(showModal === "create" || showModal === "edit") && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {showModal === "create"
                      ? "Thêm kệ sách"
                      : "Cập nhật kệ sách"}
                  </h2>
                  {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                  <div className="space-y-3">
                    <label className="block font-semibold">Mã kệ</label>
                    <input
                      type="text"
                      placeholder="Nhập mã kệ"
                      className="border rounded p-2 w-full"
                      value={formData.code || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                    />

                    <label className="block font-semibold">Vị trí</label>
                    <input
                      type="text"
                      placeholder="Nhập vị trí"
                      className="border rounded p-2 w-full"
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />

                    <label className="block font-semibold">Sức chứa</label>
                    <input
                      type="number"
                      placeholder="Nhập sức chứa"
                      className="border rounded p-2 w-full"
                      value={formData.capacity || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: Number(e.target.value),
                        })
                      }
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
                      className={`px-4 py-2 text-white rounded ${
                        loadingSubmit ? "bg-gray-400" : "bg-blue-500"
                      }`}
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
