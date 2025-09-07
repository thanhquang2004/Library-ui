import DashboardPage from "./DashboardPage";
// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import CustomBar from "../components/CustomBar";
import Skeleton from "../components/Skeleton";

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

interface AuditUser {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
}

interface AuditTarget {
  id: string;
  model: ModelName | string;
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
  duration: number; // days
}

// ================== Component ==================
const HomePage: React.FC = () => {
  const { user, token } = useAuth();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelName | "User">(
    "User"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- helpers ----------
  const processData = (src: AuditLog[]) => {
    const userMap: Record<string, { name: string; timestamps: number[] }> = {};

    for (const log of src) {
      // Thêm kiểm tra null/undefined cho log.user
      if (!log.user || !log.user._id) {
        continue; // Bỏ qua bản ghi nếu user hoặc _id không tồn tại
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
        const durationHours = (max - min) / 1000 / 60 / 60;
        const durationDays = durationHours / 24;
        return {
          userId,
          name,
          duration: Number.isFinite(durationDays) ? durationDays : 0,
        };
      }
    );

    setChartData(results);
  };

  // ---------- API calls ----------
  const fetchAuditLogs = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const allLogs: AuditLog[] = [];
      let currentPage = 1;
      const limit = 100;
      let hasMore = true;
      const delay = 500; // Thêm độ trễ để tránh lỗi 429

      while (hasMore) {
        const res = await axios.get<ApiEnvelope<AuditLogsResponse>>(
          `${API_BASE}/audit-logs`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { page: currentPage, limit: limit, model: selectedModel }
          }
        );

        const data = res.data?.data;
        if (data?.auditLogs && data.auditLogs.length > 0) {
          allLogs.push(...data.auditLogs);
          if (data.total !== undefined && allLogs.length >= data.total) {
            hasMore = false;
          } else {
            currentPage++;
            if (hasMore) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        } else {
          hasMore = false;
        }
      }

      processData(allLogs);
    } catch (e: unknown) {
      const err = e as AxiosError;
      console.error("❌ Error fetching audit logs:", err.response ?? err);
      setChartData([]);
      if (err.response?.status === 429) {
          setError("Tải dữ liệu thất bại: Vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.");
      } else {
          setError("Không thể tải dữ liệu thống kê.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, selectedModel]);

  // ---------- Effects ----------
  useEffect(() => {
    if (token && user?.role === "admin") {
      fetchAuditLogs();
    }
  }, [token, user, fetchAuditLogs]);

  const canViewChart = user?.role === "admin";

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Hello, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Chào mừng bạn quay trở lại hệ thống.
          </p>
        </div>


        {/* Nếu role = librarian thì hiển thị Dashboard */}
        {user?.role === "librarian" && (
          <div className="mt-6">
            <DashboardPage />

        {canViewChart && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              📊 Thống kê hoạt động chung
            </h2>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Chọn model để xem thống kê:
              </h3>
              <select
                onChange={(e) =>
                  setSelectedModel(e.target.value as ModelName | "User")
                }
                className="border px-3 py-2 rounded-lg"
                value={selectedModel}
              >
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
              <p className="mt-4 text-center text-sm font-semibold">
                Thời gian hoạt động (ngày)
              </p>
            </div>

            {loading ? (
              <div className="w-full h-[400px]">
                <Skeleton className="h-full" />
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : chartData.length === 0 ? (
              <p className="text-gray-500">
                Không có dữ liệu hoạt động cho model này.
              </p>
            ) : (
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
                      shape={<CustomBar />}
                      className="cursor-pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-4 text-center text-sm text-gray-500">
                  Biểu đồ tổng thời gian hoạt động của người dùng trên model{" "}
                  <strong>{selectedModel}</strong>.
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default HomePage;