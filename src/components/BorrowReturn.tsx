// import React from "react";

// const BorrowReturn: React.FC = () => {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">🔄 Quản lý mượn/trả</h2>
//       <p>Chức năng: Xử lý mượn sách, trả sách, gia hạn, đặt trước...</p>
//     </div>
//   );
// };

// export default BorrowReturn;
// import React from "react";
// import { FaExchangeAlt, FaUserCheck, FaBookOpen, FaClock, FaCalendarPlus, FaSearch, FaQrcode, FaHistory } from "react-icons/fa";

// const BorrowReturn: React.FC = () => {
//   return (
//     <div className="p-8 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
//             <FaExchangeAlt className="text-white text-xl" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Quản lý mượn/trả</h1>
//             <p className="text-gray-600">Xử lý mượn sách, trả sách, gia hạn, đặt trước</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer group">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
//               <FaBookOpen className="text-white text-2xl" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Mượn sách</h3>
//             <p className="text-gray-600 text-sm">Xử lý yêu cầu mượn sách mới</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer group">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
//               <FaUserCheck className="text-white text-2xl" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Trả sách</h3>
//             <p className="text-gray-600 text-sm">Xử lý việc trả sách</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer group">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
//               <FaClock className="text-white text-2xl" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Gia hạn</h3>
//             <p className="text-gray-600 text-sm">Gia hạn thời gian mượn</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer group">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
//               <FaCalendarPlus className="text-white text-2xl" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Đặt trước</h3>
//             <p className="text-gray-600 text-sm">Đặt trước sách đang được mượn</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Search Section */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
//               <FaSearch className="text-blue-600" />
//               Tra cứu độc giả
//             </h3>
//           </div>
          
//           <div className="p-6 space-y-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Nhập mã độc giả hoặc số điện thoại..."
//                 className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//               <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600">
//                 <FaQrcode className="text-xl" />
//               </button>
//             </div>
            
//             {/* Reader Info Card */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
//                   <span className="text-white font-bold">NV</span>
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-semibold text-gray-800">Nguyễn Văn A</h4>
//                   <p className="text-sm text-gray-600">ID: DG001 • Sinh viên</p>
//                   <p className="text-sm text-gray-600">Điện thoại: 0123456789</p>
//                 </div>
//                 <div className="text-right">
//                   <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                     Hoạt động
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Current Borrowings */}
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">Sách đang mượn (2)</h4>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                   <div className="w-8 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
//                     <FaBookOpen className="text-blue-600 text-xs" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800">Lập trình JavaScript</p>
//                     <p className="text-xs text-gray-600">Hạn trả: 15/09/2025</p>
//                   </div>
//                   <span className="text-xs text-orange-600 font-medium">3 ngày</span>
//                 </div>
                
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                   <div className="w-8 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded flex items-center justify-center">
//                     <FaBookOpen className="text-green-600 text-xs" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800">Cơ sở dữ liệu</p>
//                     <p className="text-xs text-gray-600">Hạn trả: 20/09/2025</p>
//                   </div>
//                   <span className="text-xs text-green-600 font-medium">8 ngày</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transaction History */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
//               <FaHistory className="text-purple-600" />
//               Lịch sử giao dịch
//             </h3>
//           </div>
          
//           <div className="p-6">
//             <div className="space-y-4">
//               {[
//                 { type: 'borrow', book: 'React Handbook', time: '10:30 AM', date: 'Hôm nay', user: 'Trần Thị B' },
//                 { type: 'return', book: 'Vue.js Guide', time: '09:15 AM', date: 'Hôm nay', user: 'Lê Văn C' },
//                 { type: 'extend', book: 'Node.js Basics', time: '08:45 AM', date: 'Hôm nay', user: 'Phạm Thị D' },
//                 { type: 'borrow', book: 'Python Programming', time: '04:20 PM', date: 'Hôm qua', user: 'Hoàng Văn E' },
//               ].map((item, index) => (
//                 <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     item.type === 'borrow' ? 'bg-blue-100 text-blue-600' :
//                     item.type === 'return' ? 'bg-green-100 text-green-600' :
//                     'bg-orange-100 text-orange-600'
//                   }`}>
//                     {item.type === 'borrow' ? '📚' : item.type === 'return' ? '✅' : '🔄'}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800">{item.book}</p>
//                     <p className="text-xs text-gray-600">{item.user} • {item.date} {item.time}</p>
//                   </div>
//                   <div className={`text-xs px-2 py-1 rounded-full font-medium ${
//                     item.type === 'borrow' ? 'bg-blue-100 text-blue-800' :
//                     item.type === 'return' ? 'bg-green-100 text-green-800' :
//                     'bg-orange-100 text-orange-800'
//                   }`}>
//                     {item.type === 'borrow' ? 'Mượn' : item.type === 'return' ? 'Trả' : 'Gia hạn'}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-4 text-center">
//               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                 Xem thêm lịch sử →
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Hôm nay</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">47</p>
//               <p className="text-green-600 text-xs mt-1">↗ +12% so với hôm qua</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//               <FaBookOpen className="text-green-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Sách trả</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">52</p>
//               <p className="text-blue-600 text-xs mt-1">↗ +8% so với hôm qua</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//               <FaUserCheck className="text-blue-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Quá hạn</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
//               <p className="text-red-600 text-xs mt-1">Cần xử lý ngay</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//               <FaClock className="text-red-600 text-xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BorrowReturn;
// import React, { useEffect, useState } from "react";
// import {
//   FaExchangeAlt,
  
//   FaSearch,
//   FaUser,
  
// } from "react-icons/fa";
// import api from "../api"; // axios instance chung

// interface Lending {
//   _id: string;
//   member: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   book: {
//     _id: string;
//     title: string;
//   };
//   status: "borrowing" | "returned" | "overdue";
//   borrowDate: string;
//   dueDate: string;
//   returnDate?: string;
// }

// const BorrowReturn: React.FC = () => {
//   const [lendings, setLendings] = useState<Lending[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   const fetchLendings = async () => {
//     try {
//       const res = await api.get("/booklendings");
//       setLendings(res.data);
//     } catch (err) {
//       console.error("Error fetching lendings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLendings();
//   }, []);

//   const returnBook = async (id: string) => {
//     try {
//       await api.put(`/booklendings/${id}/return`);
//       setLendings((prev) =>
//         prev.map((l) => (l._id === id ? { ...l, status: "returned" } : l))
//       );
//     } catch (err) {
//       console.error("Error returning book:", err);
//     }
//   };

//   const extendLending = async (id: string) => {
//     try {
//       await api.put(`/booklendings/${id}/extend`);
//       alert("Gia hạn thành công");
//     } catch (err) {
//       console.error("Error extending lending:", err);
//     }
//   };

//   const deleteLending = async (id: string) => {
//     try {
//       await api.delete(`/booklendings/${id}`);
//       setLendings((prev) => prev.filter((l) => l._id !== id));
//     } catch (err) {
//       console.error("Error deleting lending:", err);
//     }
//   };

//   const filteredLendings = lendings.filter((l) => {
//     const matchSearch =
//       l.member?.name?.toLowerCase().includes(search.toLowerCase()) ||
//       l.book?.title?.toLowerCase().includes(search.toLowerCase());
//     const matchFilter =
//       filter === "all" ? true : l.status.toLowerCase() === filter;
//     return matchSearch && matchFilter;
//   });

//   return (
//     <div className="p-8 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8 flex items-center gap-4">
//         <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
//           <FaExchangeAlt className="text-white text-xl" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Quản lý mượn/trả</h1>
//           <p className="text-gray-600">
//             Xử lý mượn sách, trả sách, gia hạn, đặt trước
//           </p>
//         </div>
//       </div>

//       {/* Search & Filter */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
//             <FaSearch className="text-blue-600" />
//             Tra cứu phiếu mượn
//           </h3>
//           <select
//             className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             <option value="all">Tất cả</option>
//             <option value="borrowing">Đang mượn</option>
//             <option value="returned">Đã trả</option>
//             <option value="overdue">Quá hạn</option>
//           </select>
//         </div>
//         <input
//           type="text"
//           placeholder="Tìm theo tên độc giả hoặc tên sách..."
//           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Lending List */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Độc giả</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sách</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày mượn</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạn trả</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 text-gray-500">
//                   Đang tải dữ liệu...
//                 </td>
//               </tr>
//             ) : filteredLendings.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 text-gray-500">
//                   Không có dữ liệu
//                 </td>
//               </tr>
//             ) : (
//               filteredLendings.map((lending) => (
//                 <tr key={lending._id} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 flex items-center gap-3">
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <FaUser className="text-green-600" />
//                     </div>
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {lending.member?.name}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {lending.member?.email}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">{lending.book?.title}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {new Date(lending.borrowDate).toLocaleDateString("vi-VN")}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {new Date(lending.dueDate).toLocaleDateString("vi-VN")}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         lending.status === "borrowing"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : lending.status === "returned"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {lending.status === "borrowing"
//                         ? "Đang mượn"
//                         : lending.status === "returned"
//                         ? "Đã trả"
//                         : "Quá hạn"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex gap-2">
//                     {lending.status === "borrowing" && (
//                       <>
//                         <button
//                           onClick={() => returnBook(lending._id)}
//                           className="text-green-600 hover:text-green-900 text-sm font-medium"
//                         >
//                           Trả sách
//                         </button>
//                         <button
//                           onClick={() => extendLending(lending._id)}
//                           className="text-blue-600 hover:text-blue-900 text-sm font-medium"
//                         >
//                           Gia hạn
//                         </button>
//                       </>
//                     )}
//                     <button
//                       onClick={() => deleteLending(lending._id)}
//                       className="text-red-600 hover:text-red-900 text-sm font-medium"
//                     >
//                       Xóa
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BorrowReturn;
import React, { useEffect, useState } from "react";
import { FaExchangeAlt, FaSearch, FaUser } from "react-icons/fa";
import api from "../api"; // axios instance chung

interface Lending {
  _id: string;
  member: {
    _id: string;
    name: string;
    email: string;
  };
  book: {
    _id: string;
    title: string;
  };
  status: "borrowing" | "returned" | "overdue";
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

const BorrowReturn: React.FC = () => {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchLendings = async () => {
    try {
      const res = await api.get("/book-lendings");
      setLendings(res.data);
    } catch (err) {
      console.error("Error fetching lendings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLendings();
  }, []);

  const returnBook = async (id: string) => {
    try {
      await api.put(`/book-lendings/${id}/return`);
      setLendings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: "returned" } : l))
      );
    } catch (err) {
      console.error("Error returning book:", err);
    }
  };

  const extendLending = async (id: string) => {
    try {
      await api.put(`/book-lendings/${id}/extend`);
      alert("Gia hạn thành công");
    } catch (err) {
      console.error("Error extending lending:", err);
    }
  };

  const deleteLending = async (id: string) => {
    try {
      await api.delete(`/book-lendings/${id}`);
      setLendings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Error deleting lending:", err);
    }
  };

  const filteredLendings = lendings.filter((l) => {
    const matchSearch =
      l.member?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.book?.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true : l.status.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <FaExchangeAlt className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý mượn/trả</h1>
          <p className="text-gray-600">
            Xử lý mượn sách, trả sách, gia hạn, đặt trước
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
            <FaSearch className="text-blue-600" />
            Tra cứu phiếu mượn
          </h3>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="borrowing">Đang mượn</option>
            <option value="returned">Đã trả</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Tìm theo tên độc giả hoặc tên sách..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lending List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Độc giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sách</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày mượn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạn trả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLendings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredLendings.map((lending) => (
                <tr key={lending._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lending.member?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lending.member?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{lending.book?.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(lending.borrowDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(lending.dueDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lending.status === "borrowing"
                          ? "bg-yellow-100 text-yellow-800"
                          : lending.status === "returned"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lending.status === "borrowing"
                        ? "Đang mượn"
                        : lending.status === "returned"
                        ? "Đã trả"
                        : "Quá hạn"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {lending.status === "borrowing" && (
                      <>
                        <button
                          onClick={() => returnBook(lending._id)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Trả sách
                        </button>
                        <button
                          onClick={() => extendLending(lending._id)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Gia hạn
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteLending(lending._id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowReturn;

