import React, { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import CustomBar from "../components/CustomBar";
import api from "../api";

// ================== Types ==================
type ModelName =
  | "User"
  | "Library"
  | "BookItem"
  | "Payment"
  | "Fine"
  | "Rack"
  | "LibraryCard"
  | "Book"
  | "Author"
  | "BookLending"
  | "BookReservation"
  | "Category";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface UserItem {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
}

interface UsersResponse {
  users: UserItem[];
  total?: number;
  page?: number;
  limit?: number;
}

interface AuditUser {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
}

interface AuditTarget {
  id: string;
  model: ModelName | string; // phòng khi backend còn log model lạ
}

type AuditDetails = string | Record<string, unknown> | null | undefined;

interface AuditLog {
  user: AuditUser;
  action: string;
  target: AuditTarget;
  details?: AuditDetails;
  timestamp: string; // ISO
}

interface AuditLogsResponse {
  auditLogs: AuditLog[];
  total?: number;
  page?: number;
  limit?: number;
}

interface ChartData {
  userId: string;
  name: string;
  duration: number; // số hành động
}

// ================== Component ==================
const ActivitiesLogPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelName | "">("");

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  

  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------- helpers ----------
  const prettyDetails = (d: AuditDetails): string => {
    if (d == null) return "";
    return typeof d === "string" ? d : JSON.stringify(d, null, 2);
  };

  const processDataForChart = (src: AuditLog[]) => {
    const userMap: Record<string, { name: string; actionCount: number }> = {};

    for (const log of src) {
      if (!log.user || !log.user._id) {
        continue;
      }
      const userId = log.user._id;
      if (!userMap[userId]) {
        userMap[userId] = {
          name: log.user.username || log.user.name,
          actionCount: 0,
        };
      }
      userMap[userId].actionCount++;
    }

    const results: ChartData[] = Object.entries(userMap).map(
      ([userId, { name, actionCount }]) => {
        return {
          userId,
          name,
          duration: actionCount, // Thay đổi: 'duration' giờ là tổng số hành động
        };
      }
    );

    setChartData(results);
    
  };

  // ---------- API calls ----------
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoadingUsers(false);
      setError("Không có token xác thực.");
      return;
    }
    setLoadingUsers(true);
    setError(null);
    try {
      const res = await api.get<ApiEnvelope<UsersResponse>>(`/users`, {
        params: { page: 1, limit: 100 },
      });
      if (res.data.success) {
        const list = res.data?.data?.users ?? [];
        setUsers(list);
      } else {
        setUsers([]);
        setError("Không thể tải danh sách người dùng. Vui lòng kiểm tra quyền truy cập.");
      }
    } catch (e: unknown) {
      const err = e as AxiosError;
      setUsers([]);
      if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập vào mục này.");
      } else {
        setError("Không thể tải danh sách người dùng.");
      }
    } finally {
      setLoadingUsers(false);
    }
  }, [token]);


  const fetchLogs = useCallback(async (
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    fetchChart: boolean = false
  ) => {
    if (!token) return;
    setLoadingLogs(true);
    setError(null);
    
    // Calculate startDate for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString();
    
    try {
      if (fetchChart) {
        // 1. Fetch ALL data for the chart (no pagination)
        const chartRes = await api.get<ApiEnvelope<AuditLogsResponse>>(
          endpoint,
          { params: { startDate } }
        );
        processDataForChart(chartRes.data?.data?.auditLogs || []);
      }

      // 2. Fetch paginated data for the table
      const tableRes = await api.get<ApiEnvelope<AuditLogsResponse>>(
        endpoint,
        {
          params: { page, limit },
        }
      );
      const data = tableRes.data?.data;
      if (data?.auditLogs && data.auditLogs.length > 0) {
        setLogs(data.auditLogs);
        setTotalPages(Math.ceil((data.total ?? 0) / limit));
        setCurrentPage(page);
      } else {
        setLogs([]);
        setTotalPages(1);
      }
    } catch (e: unknown) {
      const err = e as AxiosError;
      setLogs([]);
      if (err.response?.status === 429) {
        setError("Tải dữ liệu thất bại: Vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.");
      } else {
        setError("Không thể tải audit logs. Vui lòng thử lại.");
      }
    } finally {
      setLoadingLogs(false);
    }
  }, [token]);


  // ---------- Effects ----------
  useEffect(() => {
    if (token) void fetchUsers();
  }, [token, fetchUsers]);

  useEffect(() => {
    if (selectedUser?._id) {
      setLogs([]);
      setChartData([]);
      setCurrentPage(1); // Reset page when user changes
      void fetchLogs(`/audit-logs/user/${selectedUser._id}`, 1, 10, true);
      setSelectedModel("");
    }
  }, [selectedUser, fetchLogs]);

  useEffect(() => {
    if (selectedModel) {
      setLogs([]);
      setChartData([]);
      setCurrentPage(1); // Reset page when model changes
      void fetchLogs(`/audit-logs/model/${selectedModel}`, 1, 10, true);
      setSelectedUser(null);
    }
  }, [selectedModel, fetchLogs]);

  // New useEffect to handle page changes for the TABLE only
  useEffect(() => {
    if (selectedUser?._id) {
      void fetchLogs(`/audit-logs/user/${selectedUser._id}`, currentPage, 10, false);
    } else if (selectedModel) {
      void fetchLogs(`/audit-logs/model/${selectedModel}`, currentPage, 10, false);
    }
  }, [currentPage, selectedUser, selectedModel, fetchLogs]);

  // ---------- Render ----------
  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="p-6 flex-1 overflow-y-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          ⬅ Quay lại trang chủ
        </button>

        <h2 className="text-2xl font-bold text-blue-600 mb-6">📊 Thống kê hoạt động</h2>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Theo người dùng */}
          <div>
            <h3 className="font-semibold mb-2">Theo người dùng:</h3>
            {loadingUsers ? (
              <p>Đang tải danh sách...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">{error || "Không có người dùng"}</p>
            ) : (
              <select
                onChange={(e) => {
                  const u = users.find((us) => us._id === e.target.value) || null;
                  setSelectedUser(u);
                }}
                className="border px-3 py-2 rounded-lg min-w-[280px]"
                value={selectedUser?._id || ""}
              >
                <option value="">-- Chọn người dùng --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username || u.name} ({u.role}) - {u.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Theo model */}
          <div>
            <h3 className="font-semibold mb-2">Theo model:</h3>
            <select
              onChange={(e) => setSelectedModel(e.target.value as ModelName | "")}
              className="border px-3 py-2 rounded-lg"
              value={selectedModel}
            >
              <option value="">-- Chọn model --</option>
              <option value="User">User</option>
              <option value="Library">Library</option>
              <option value="BookItem">BookItem</option>
              <option value="Payment">Payment</option>
              <option value="Fine">Fine</option>
              <option value="Rack">Rack</option>
              <option value="LibraryCard">LibraryCard</option>
              <option value="Book">Book</option>
              <option value="Author">Author</option>
              <option value="BookLending">BookLending</option>
              <option value="BookReservation">BookReservation</option>
              <option value="Category">Category</option>
            </select>
          </div>
        </div>

        {/* Error global (nếu có) */}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
                📊 Biểu đồ thống kê (7 ngày gần nhất)
            </h2>
            {loadingLogs ? (
                <p>⏳ Đang tải dữ liệu biểu đồ...</p>
            ) : chartData.length === 0 ? (
                <p className="text-gray-500">
                    Không có dữ liệu hoạt động cho mục đã chọn trong 7 ngày gần nhất.
                </p>
            ) : (
                <>
                {selectedUser && (
                    <p className="mb-4">
                    ⏱ Tổng số hành động của{" "}
                    <strong>{selectedUser.username || selectedUser.name}</strong>:{" "}
                    {chartData.find(d => d.userId === selectedUser._id)?.duration || 0} hành động
                    </p>
                )}
                <div className="mb-8">
                    <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip
                            formatter={(value: number) =>
                                `${value} hành động`
                            }
                        />
                        <Bar
                            dataKey="duration"
                            shape={<CustomBar selectedUserId={selectedUser?._id} />}
                        />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </>
            )}
        </div>

        {/* Logs */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
                📋 Nhật ký hoạt động chi tiết
            </h2>
            {loadingLogs ? (
                <p>⏳ Đang tải dữ liệu chi tiết...</p>
            ) : logs.length === 0 ? (
                <p className="text-gray-500">Không có dữ liệu</p>
            ) : (
                <>
                <table className="min-w-full border border-gray-200 mb-6">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Tên</th>
                        <th className="border px-4 py-2">Hành động</th>
                        <th className="border px-4 py-2">Model</th>
                        
                        <th className="border px-4 py-2">Chi tiết</th>
                        <th className="border px-4 py-2">Thời gian</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{log.user?.username || log.user?.name || 'N/A'}</td>
                        <td className="border px-4 py-2">{log.action || 'N/A'}</td>
                        <td className="border px-4 py-2">{log.target?.model || 'N/A'}</td>
                       
                        <td className="border px-4 py-2 whitespace-pre-wrap">
                            {prettyDetails(log.details)}
                        </td>
                        <td className="border px-4 py-2">
                            {new Date(log.timestamp).toLocaleString("vi-VN", { dateStyle: 'short' })}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || loadingLogs}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Trang trước
                    </button>
                    <span>
                        Trang {currentPage} trên {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || loadingLogs}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Trang sau
                    </button>
                </div>
                </>
            )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ActivitiesLogPage;