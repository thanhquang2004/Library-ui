// import React from "react";

// const FeeManager: React.FC = () => {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">💰 Quản lý phí & phạt</h2>
//       <p>Chức năng: Tính phí phạt trả trễ, hư hỏng, mất sách, theo dõi thanh toán...</p>
//     </div>
//   );
// };

// export default FeeManager;
// import React from "react";
// import { FaMoneyBill, FaClock, FaExclamationTriangle, FaCheckCircle, FaSearch,  FaDollarSign, FaUser} from "react-icons/fa";

// const FeeManager: React.FC = () => {
//   return (
//     <div className="p-8 bg-gradient-to-br from-gray-50 to-yellow-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//             <FaMoneyBill className="text-white text-xl" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Quản lý phí & phạt</h1>
//             <p className="text-gray-600">Tính phí phạt trả trễ, hư hỏng, mất sách, theo dõi thanh toán</p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Tổng phí phạt</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">2,450,000₫</p>
//               <p className="text-red-600 text-xs mt-1">↗ +8% tháng này</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//               <FaDollarSign className="text-red-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Đã thanh toán</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">1,850,000₫</p>
//               <p className="text-green-600 text-xs mt-1">75% tổng số</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//               <FaCheckCircle className="text-green-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Chưa thanh toán</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">600,000₫</p>
//               <p className="text-orange-600 text-xs mt-1">25% tổng số</p>
//             </div>
//             <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
//               <FaClock className="text-orange-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Quá hạn</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
//               <p className="text-red-600 text-xs mt-1">Cần xử lý</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//               <FaExclamationTriangle className="text-red-600 text-xl" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Fee Structure */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800">Bảng phí phạt</h3>
//           </div>
          
//           <div className="p-6 space-y-4">
//             <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
//               <h4 className="font-semibold text-gray-800 mb-3">Trả trễ</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">1-3 ngày:</span>
//                   <span className="font-medium">2,000₫/ngày</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">4-7 ngày:</span>
//                   <span className="font-medium">3,000₫/ngày</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Trên 7 ngày:</span>
//                   <span className="font-medium">5,000₫/ngày</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
//               <h4 className="font-semibold text-gray-800 mb-3">Hư hỏng/Mất</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Hư hỏng nhẹ:</span>
//                   <span className="font-medium">20% giá sách</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Hư hỏng nặng:</span>
//                   <span className="font-medium">50% giá sách</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Mất sách:</span>
//                   <span className="font-medium">100% giá sách</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
//               <h4 className="font-semibold text-gray-800 mb-3">Phí dịch vụ</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Làm thẻ mới:</span>
//                   <span className="font-medium">20,000₫</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Đặt sách:</span>
//                   <span className="font-medium">5,000₫</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Fee List */}
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Danh sách phí phạt</h3>
//               <div className="flex gap-2">
//                 <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
//                   <option>Tất cả trạng thái</option>
//                   <option>Chưa thanh toán</option>
//                   <option>Đã thanh toán</option>
//                   <option>Quá hạn</option>
//                 </select>
//               </div>
//             </div>
            
//             <div className="relative">
//               <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm theo tên độc giả hoặc mã phạt..."
//                 className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độc giả</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại phạt</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {[
//                   { id: 'PH001', reader: 'Nguyễn Văn A', book: 'Lập trình Java', type: 'Trả trễ', amount: 15000, status: 'unpaid', days: 5, date: '01/09/2025' },
//                   { id: 'PH002', reader: 'Trần Thị B', book: 'Cơ sở dữ liệu', type: 'Hư hỏng', amount: 50000, status: 'paid', days: 0, date: '28/08/2025' },
//                   { id: 'PH003', reader: 'Lê Văn C', book: 'Python Programming', type: 'Trả trễ', amount: 21000, status: 'overdue', days: 7, date: '25/08/2025' },
//                   { id: 'PH004', reader: 'Phạm Thị D', book: 'Web Development', type: 'Mất sách', amount: 120000, status: 'unpaid', days: 0, date: '30/08/2025' },
//                   { id: 'PH005', reader: 'Hoàng Văn E', book: 'Machine Learning', type: 'Trả trễ', amount: 8000, status: 'paid', days: 2, date: '02/09/2025' },
//                 ].map((fee) => (
//                   <tr key={fee.id} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mr-3">
//                           <FaUser className="text-yellow-600 text-sm" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{fee.reader}</div>
//                           <div className="text-xs text-gray-500">{fee.book}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         fee.type === 'Trả trễ' ? 'bg-orange-100 text-orange-800' :
//                         fee.type === 'Hư hỏng' ? 'bg-red-100 text-red-800' :
//                         'bg-purple-100 text-purple-800'
//                       }`}>
//                         {fee.type}
//                         {fee.days > 0 && ` (${fee.days} ngày)`}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {fee.amount.toLocaleString('vi-VN')}₫
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         fee.status === 'paid' ? 'bg-green-100 text-green-800' :
//                         fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {fee.status === 'paid' ? (
//                           <>
//                             <FaCheckCircle className="mr-1" />
//                             Đã thanh toán
//                           </>
//                         ) : fee.status === 'overdue' ? (
//                           <>
//                             <FaExclamationTriangle className="mr-1" />
//                             Quá hạn
//                           </>
//                         ) : (
//                           <>
//                             <FaClock className="mr-1" />
//                             Chưa thanh toán
//                           </>
//                         )}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {fee.date}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         {fee.status === 'unpaid' || fee.status === 'overdue' ? (
//                           <button className="text-green-600 hover:text-green-900 text-sm font-medium">
//                             Thu phí
//                           </button>
//                         ) : null}
//                         <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
//                           Chi tiết
//                         </button>
//                         <button className="text-red-600 hover:text-red-900 text-sm font-medium">
//                           Hủy
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">5</span> của{' '}
//               <span className="font-medium">47</span> phí phạt
//             </div>
//             <div className="flex gap-2">
//               <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//                 Trước
//               </button>
//               <button className="px-3 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg">
//                 1
//               </button>
//               <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//                 2
//               </button>
//               <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//                 Sau
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Payments */}
//       <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-800">Thanh toán gần đây</h3>
//         </div>
        
//         <div className="p-6">
//           <div className="space-y-4">
//             {[
//               { reader: 'Hoàng Văn E', amount: 8000, type: 'Trả trễ', time: '14:30', date: 'Hôm nay' },
//               { reader: 'Trần Thị B', amount: 50000, type: 'Hư hỏng', time: '10:15', date: 'Hôm nay' },
//               { reader: 'Nguyễn Thị F', amount: 12000, type: 'Trả trễ', time: '16:45', date: 'Hôm qua' },
//               { reader: 'Lê Văn G', amount: 20000, type: 'Làm thẻ mới', time: '09:20', date: 'Hôm qua' },
//             ].map((payment, index) => (
//               <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                     <FaCheckCircle className="text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{payment.reader}</p>
//                     <p className="text-xs text-gray-600">{payment.type} • {payment.date} {payment.time}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-semibold text-green-600">
//                     +{payment.amount.toLocaleString('vi-VN')}₫
//                   </p>
//                   <p className="text-xs text-gray-500">Đã thanh toán</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeeManager;
import React, { useEffect, useState } from "react";
import api from "../api"; // axios instance
import {
  FaMoneyBill,


  FaCheckCircle,
  FaSearch,

  FaUser,
} from "react-icons/fa";

interface Fine {
  fineId: string;
  member: {
    _id: string;
    email: string;
    role: string;
  };
  amount: number;
  reason: string;
  status: "unpaid" | "paid" | "overdue";
  created?: string;
}

const FeeManager: React.FC = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [recentPayments, setRecentPayments] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchFines = async () => {
    try {
      const res = await api.get("/fines/search");
      setFines(res.data);
    } catch (err) {
      console.error("Error fetching fines:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const res = await api.get("/fines/search?status=paid");
      const sorted = res.data
        .sort(
          (a: Fine, b: Fine) =>
            new Date(b.created || "").getTime() -
            new Date(a.created || "").getTime()
        )
        .slice(0, 5); // lấy 5 giao dịch gần nhất
      setRecentPayments(sorted);
    } catch (err) {
      console.error("Error fetching recent payments:", err);
    }
  };

  useEffect(() => {
    fetchFines();
    fetchRecentPayments();
  }, []);

  const totalFine = fines.reduce((sum, f) => sum + f.amount, 0);
  const paidTotal = fines
    .filter((f) => f.status === "paid")
    .reduce((s, f) => s + f.amount, 0);
  const unpaidTotal = fines
    .filter((f) => f.status === "unpaid")
    .reduce((s, f) => s + f.amount, 0);
  const overdueCount = fines.filter((f) => f.status === "overdue").length;

  const filteredFines = fines.filter((f) => {
    const matchStatus = filter === "all" ? true : f.status === filter;
    const matchSearch =
      search === ""
        ? true
        : f.member.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const markAsPaid = async (id: string) => {
    try {
      await api.put(`/fines/${id}/paid`);
      setFines((prev) =>
        prev.map((f) => (f.fineId === id ? { ...f, status: "paid" } : f))
      );
      fetchRecentPayments(); // refresh recent payments
    } catch (err) {
      console.error("Error marking as paid:", err);
    }
  };

  const deleteFine = async (id: string) => {
    try {
      await api.delete(`/fines/${id}`);
      setFines((prev) => prev.filter((f) => f.fineId !== id));
    } catch (err) {
      console.error("Error deleting fine:", err);
    }
  };

  if (loading) return <p className="p-8">Đang tải dữ liệu...</p>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-yellow-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <FaMoneyBill className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý phí & phạt</h1>
          <p className="text-gray-600">
            Tính phí phạt trả trễ, hư hỏng, mất sách, theo dõi thanh toán
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <p className="text-gray-600 text-sm">Tổng phí phạt</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {totalFine.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <p className="text-gray-600 text-sm">Đã thanh toán</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {paidTotal.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <p className="text-gray-600 text-sm">Chưa thanh toán</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {unpaidTotal.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <p className="text-gray-600 text-sm">Quá hạn</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{overdueCount}</p>
        </div>
      </div>

      {/* Fee List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách phí phạt</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>
        <div className="relative p-4">
          <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Độc giả
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Lý do
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Số tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFines.map((fee) => (
                <tr key={fee.fineId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-yellow-600" />
                      {fee.member?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">{fee.reason}</td>
                  <td className="px-6 py-4">{fee.amount.toLocaleString("vi-VN")}₫</td>
                  <td className="px-6 py-4">
                    {fee.status === "paid" ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Đã thanh toán</span>
                    ) : fee.status === "unpaid" ? (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Chưa thanh toán</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Quá hạn</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {fee.created ? new Date(fee.created).toLocaleDateString("vi-VN") : "-"}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {fee.status !== "paid" && (
                      <button
                        onClick={() => markAsPaid(fee.fineId)}
                        className="text-green-600 hover:underline"
                      >
                        Thu phí
                      </button>
                    )}
                    <button
                      onClick={() => deleteFine(fee.fineId)}
                      className="text-red-600 hover:underline"
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Thanh toán gần đây</h3>
        </div>
        <div className="p-6 space-y-4">
          {recentPayments.map((payment) => (
            <div
              key={payment.fineId}
              className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.member?.email}
                  </p>
                  <p className="text-xs text-gray-600">
                    {payment.reason} •{" "}
                    {payment.created
                      ? new Date(payment.created).toLocaleString("vi-VN")
                      : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  +{payment.amount.toLocaleString("vi-VN")}₫
                </p>
                <p className="text-xs text-gray-500">Đã thanh toán</p>
              </div>
            </div>
          ))}
          {recentPayments.length === 0 && (
            <p className="text-gray-500 text-sm">Chưa có thanh toán nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeManager;
