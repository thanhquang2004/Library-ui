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
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import CustomBar from "../components/CustomBar";
import Skeleton from "../components/Skeleton";
import DashboardPage from "./DashboardPage";
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

  // New states for the paginated table
  const [paginatedLogs, setPaginatedLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingTable, setLoadingTable] = useState(false);

  // ---------- helpers ----------
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
          duration: actionCount,
        };
      }
    );
    setChartData(results);
  };
  
  const prettyDetails = (d: AuditDetails): string => {
    if (d == null) return "";
    return typeof d === "string" ? d : JSON.stringify(d, null, 2);
  };

  // ---------- API calls ----------
  const fetchHomePageData = useCallback(async (model: ModelName | "User", page: number = 1) => {
    if (!token) return;
    setLoading(true);
    setLoadingTable(true);
    setError(null);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString();

    try {
      // 1. Fetch data for the chart using api
      const chartRes = await api.get<ApiEnvelope<AuditLogsResponse>>(
        `/audit-logs`,
        {
          params: { startDate, model: model }, 
        }
      );
      processDataForChart(chartRes.data?.data?.auditLogs || []);

      // 2. Fetch paginated data for the table using api
      const tableRes = await api.get<ApiEnvelope<AuditLogsResponse>>(
        `/audit-logs`,
        {
          params: { page: page, limit: 10, model: model }
        }
      );
      const tableData = tableRes.data?.data;
      setPaginatedLogs(tableData?.auditLogs || []);
      setTotalPages(Math.ceil((tableData?.total ?? 0) / 10));
      setCurrentPage(page);

    } catch (e: unknown) {
      const err = e as AxiosError;
      console.error("❌ Error fetching data:", err.response ?? err);
      setChartData([]);
      setPaginatedLogs([]);
      if (err.response?.status === 429) {
          setError("Tải dữ liệu thất bại: Vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.");
      } else {
          setError("Không thể tải dữ liệu.");
      }
    } finally {
      setLoading(false);
      setLoadingTable(false);
    }
  }, [token]);

  // ---------- Effects ----------
  useEffect(() => {
    if (token && user?.role === "admin") {
      fetchHomePageData(selectedModel, currentPage);
    }
  }, [token, user, selectedModel, currentPage, fetchHomePageData]);

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


        {user?.role === "librarian" && (
          <div className="mt-6">
            <DashboardPage />
          </div>
        )}

        {canViewChart && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              📊 Nhật ký hoạt động chung (7 ngày gần nhất)
            </h2>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Chọn model để xem nhật ký:
              </h3>
              <select
                onChange={(e) => {
                  setSelectedModel(e.target.value as ModelName | "User");
                  setCurrentPage(1); // Reset page on model change
                }}
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
                        `${value} hành động`
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
                  Biểu đồ tổng số hành động của người dùng trên model{" "}
                  <strong>{selectedModel}</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {canViewChart && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  📋 Hoạt động chi tiết
                </h2>
                {loadingTable ? (
                    <p>⏳ Đang tải dữ liệu chi tiết...</p>
                ) : paginatedLogs.length === 0 ? (
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
                        {paginatedLogs.map((log, index) => (
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

                    <div className="flex justify-between items-center mb-4">
                        <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || loadingTable}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                        >
                        Trang trước
                        </button>
                        <span>
                        Trang {currentPage} trên {totalPages}
                        </span>
                        <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || loadingTable}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                        >
                        Trang sau
                        </button>
                    </div>
                    </>
                )}
            </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default HomePage;