// src/pages/StatisticsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
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

const API_BASE = import.meta.env.VITE_API_BASE;

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
  duration: number; // ngày
}

// ================== Component ==================
const StatisticsPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelName | "">("");

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [longestUser, setLongestUser] = useState<ChartData | null>(null);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- helpers ----------
  const prettyDetails = (d: AuditDetails): string => {
    if (d == null) return "";
    return typeof d === "string" ? d : JSON.stringify(d, null, 2);
  };

  const processData = (src: AuditLog[]) => {
    const userMap: Record<string, { name: string; timestamps: number[] }> = {};

    for (const log of src) {
      if (!log.user || !log.user._id) {
        continue;
      }
      const userId = log.user._id;
      if (!userMap[userId]) {
        userMap[userId] = {
          name: log.user.username || log.user.name,
          timestamps: [],
        };
      }
      const ts = new Date(log.timestamp).getTime();
      if (!Number.isNaN(ts)) userMap[userId].timestamps.push(ts);
    }

    const results: ChartData[] = Object.entries(userMap).map(
      ([userId, { name, timestamps }]) => {
        const min = Math.min(...timestamps);
        const max = Math.max(...timestamps);
        const durationDays = (max - min) / 1000 / 60 / 60 / 24;
        return { userId, name, duration: Number.isFinite(durationDays) ? durationDays : 0 };
      }
    );

    setChartData(results);
    setLongestUser(
      results.length
        ? results.reduce((a, b) => (b.duration > a.duration ? b : a))
        : null
    );
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
      const res = await axios.get<ApiEnvelope<UsersResponse>>(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const fetchLogs = useCallback(async (endpoint: string) => {
    if (!token) return;
    setLoadingLogs(true);
    setError(null);
    try {
      const allLogs: AuditLog[] = [];
      let currentPage = 1;
      const limit = 100;
      let hasMore = true;
      const delay = 500; // 500ms delay between requests

      while (hasMore) {
        const res = await axios.get<ApiEnvelope<AuditLogsResponse>>(
          `${API_BASE}${endpoint}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { page: currentPage, limit: limit }
          }
        );

        const data = res.data?.data;
        if (data?.auditLogs && data.auditLogs.length > 0) {
          allLogs.push(...data.auditLogs);
          if (data.total !== undefined && allLogs.length >= data.total) {
            hasMore = false;
          } else {
            currentPage++;
            // Add a delay before the next request to prevent rate limiting
            if (hasMore) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        } else {
          hasMore = false;
        }
      }

      setLogs(allLogs);
      processData(allLogs);
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
      void fetchLogs(`/audit-logs/user/${selectedUser._id}`);
      setSelectedModel("");
    }
  }, [selectedUser, fetchLogs]);

  useEffect(() => {
    if (selectedModel) {
      setLogs([]);
      void fetchLogs(`/audit-logs/model/${selectedModel}`);
      setSelectedUser(null);
    }
  }, [selectedModel, fetchLogs]);

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

        {/* Logs */}
        {loadingLogs ? (
          <p>⏳ Đang tải dữ liệu...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">Không có dữ liệu</p>
        ) : (
          <>
            {selectedUser && chartData.length > 0 ? (
                <p className="mb-4">
                  ⏱ Thời gian hoạt động của{" "}
                  <strong>{selectedUser.username || selectedUser.name}</strong>:{" "}
                  {chartData[0]?.duration.toFixed(2)} ngày
                </p>
              ) : (
                longestUser && (
                  <p className="mb-4">
                    👑 Người dùng hoạt động lâu nhất: <strong>{longestUser.name}</strong> (
                    {longestUser.duration.toFixed(2)} ngày)
                  </p>
                )
              )}

            <div className="mb-8">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip
                      formatter={(value: number) =>
                          `${value.toFixed(2)} ngày hoạt động`
                      }
                  />
                  <Bar
                    dataKey="duration"
                    shape={<CustomBar selectedUserId={selectedUser?._id} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="min-w-full border border-gray-200 mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Tên</th>
                  <th className="border px-4 py-2">Hành động</th>
                  <th className="border px-4 py-2">Model</th>
                  <th className="border px-4 py-2">Target ID</th>
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
                    <td className="border px-4 py-2">{log.target?.id || 'N/A'}</td>
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
          </>
        )}
      </div>
    </SidebarLayout>
  );
};

export default StatisticsPage;