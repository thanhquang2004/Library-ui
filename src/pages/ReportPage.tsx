import React, { useEffect, useState } from "react";
import {
  FaChartBar,
  FaBook,
  FaUsers,
  FaClock
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import api from "../api";
import ExportPDFButton from "../components/ExportPDF";

interface Lending {
  bookItem: string;
  member: string;
  fines?: string[];
  lendingDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  isDeleted: boolean;
}

const Reports: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [lendings, setLendings] = useState<Lending[]>([]);
  const [popularBooks, setPopularBooks] = useState<
    { bookId: string; borrows: number; title: string; author: string }[]
  >([]);

  const [activeReaders, setActiveReaders] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lendingRes = await api.get("/book-lendings");
        // Đảm bảo luôn là mảng
        const lendingData = Array.isArray(lendingRes.data) ? lendingRes.data : [];
        setLendings(lendingData);

        // Gom nhóm theo sách. Đếm số lượt mượn theo bookId
        const counts: Record<string, { bookId: string; borrows: number }> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lendingData.forEach((l: any) => {
          const bookId = l.bookItem?.book; // mỗi lending có bookItem.book
          if (!bookId) return;

          if (!counts[bookId]) {
            counts[bookId] = { bookId, borrows: 0 };
          }
          counts[bookId].borrows += 1;
        });


        // Lấy thông tin sách từ API /books/search
        const token = localStorage.getItem("token");
        const bookIds = Object.keys(counts);
        const booksRes = await api.get(`/books/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ids: bookIds }, // nếu API hỗ trợ query nhiều ids
        });

        // Nếu API trả về { books: [...] }
        const books = booksRes.data || [];

        // Map title/author vào counts
        const ranking = Object.values(counts)
          .map(b => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const info = books.find((bk: any) => bk._id === b.bookId);
            return {
              ...b,
              title: info?.title || "Unknown title",
              author: info?.authors?.[0]?.name || "Unknown author",
            };
          })
          .sort((a, b) => b.borrows - a.borrows);

        setPopularBooks(ranking);


        const res = await api.get(`/users`, { params: { page: 1, limit: 1000 } });
        const responseData = res.data?.data;
        const users = responseData.users || [];

        // Đếm số user hợp lệ (có mượn + chưa bị xóa)
        const activeCount = users.filter(
          (u: unknown) => (u as { accountStatus: string }).accountStatus === "active"
        ).length;
        setActiveReaders(activeCount);

      } catch (error) {
        console.error("Error fetching reports data:", error);
        setLendings([]); // fallback an toàn
      }
    };

    fetchData();
  }, []);

  const [borrowingTrends, setBorrowingTrends] = useState<{ month: number; count: number }[]>([]);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const fetchBorrowingTrends = async () => {
      try {
        const lendingRes = await api.get("/book-lendings");
        console.log("Lending data for trends:", lendingRes.data);
        const lendingData = Array.isArray(lendingRes.data) ? lendingRes.data : [];

        // 1. Gom nhóm theo tháng
        const monthlyCounts: Record<number, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lendingData.forEach((l: any) => {
          const monthKey = new Date(l.lendingDate).getMonth() + 1; // 1–12
          monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
        });

        console.log("Monthly counts:", monthlyCounts);

        // 2. Lấy 6 tháng gần nhất
        const now = new Date();
        const chartData: { month: number; count: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const m = ((now.getMonth() + 1 - i + 12) % 12) || 12;
          chartData.push({ month: m, count: monthlyCounts[m] || 0 });
        }
        setBorrowingTrends(chartData);

        console.log("borrowingTrends set to:", chartData);
        // 3. Tổng lượt mượn
        setTotalBorrows(lendingData.length);

        // 4. Tỷ lệ hoàn thành
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const returned = lendingData.filter((l: any) => l.status === "returned").length;
        const completionRate = lendingData.length > 0
          ? Math.round((returned / lendingData.length) * 100)
          : 0;
        setCompletionRate(completionRate);
      } catch (err) {
        console.error("Error fetching borrowing trends:", err);
      }
    };

    fetchBorrowingTrends();
  }, []);

  const maxCount = Math.max(...borrowingTrends.map(b => b.count), 1);

  // --- Tính toán các chỉ số ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Lượt mượn tháng này
  const monthlyLendings = lendings.filter(
    l => new Date(l.lendingDate) >= startOfMonth
  ).length;

  // Sách quá hạn
  const overdueBooks = lendings.filter(
    l =>
      l.status === "overdue" ||
      (l.status === "returned" && l.returnDate && new Date(l.returnDate) > new Date(l.dueDate))
  ).length;

  // Tỷ lệ trả đúng hạn
  const returned = lendings.filter(l => l.status === "returned");
  const returnedOnTime = returned.filter(
    l => l.returnDate && new Date(l.returnDate) <= new Date(l.dueDate)
  ).length;
  const onTimeRate = returned.length > 0 ? Math.round((returnedOnTime / returned.length) * 100) : 0;

  return (

    <SidebarLayout user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}>
      <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Báo cáo & Thống kê
              </h1>
              <p className="text-gray-600">
                Thống kê mượn/trả, sách quá hạn, danh mục phổ biến
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Export Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <ExportPDFButton
              monthlyLendings={monthlyLendings}
              activeReaders={activeReaders}
              overdueBooks={overdueBooks}
              onTimeRate={onTimeRate}
              popularBooks={popularBooks}
              borrowingTrends={borrowingTrends}
              totalBorrows={totalBorrows}
              completionRate={completionRate}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Lượt mượn tháng này */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lượt mượn tháng này</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{monthlyLendings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaBook className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Độc giả hoạt động */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Độc giả hoạt động</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{activeReaders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Sách quá hạn */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sách quá hạn</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{overdueBooks}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Tỷ lệ trả đúng hạn */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tỷ lệ trả đúng hạn</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{onTimeRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaChartBar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Popular Books Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Sách được mượn nhiều nhất
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {popularBooks.slice(0, 5).map((book, index) => (
                  <div
                    key={book.bookId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-orange-400"
                              : "bg-blue-500"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{book.title}</p>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{book.borrows} lượt</p>
                      <p className="text-xs text-green-600">↗ đang tăng</p>
                    </div>
                  </div>
                ))}
              </div>


            </div>
          </div>

          {/* Borrowing Trends */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Xu hướng mượn sách
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-end justify-between h-32">
                  {borrowingTrends.map((b, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 group cursor-pointer">
                      {/* số đếm hiển thị khi hover */}
                      <span className="mb-1 text-l text-gray-700 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {b.count}
                      </span>

                      {/* cột */}
                      <div
                        className="w-8 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg"
                        style={{
                          height: `${(b.count / maxCount) * 100}%`,
                          minHeight: b.count > 0 ? "90px" : "2px"
                        }}
                      ></div>

                      {/* tháng */}
                      <span className="text-xs text-gray-600">T{b.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{totalBorrows}</p>
                  <p className="text-sm text-gray-600">Tổng lượt mượn</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                  <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Reports;
