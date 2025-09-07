// import React from "react";
import { FaUsers, FaUserPlus, FaSearch, FaFilter, FaUser, FaPhone, FaEnvelope, FaBook, FaLock, FaUnlock } from "react-icons/fa";

const ReaderManager: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý độc giả</h1>
            <p className="text-gray-600">Quản lý tài khoản độc giả, khóa/mở tài khoản, lịch sử mượn</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã độc giả, email, số điện thoại..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
              <FaFilter className="text-sm" />
              Lọc
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg">
              <FaUserPlus className="text-sm" />
              Thêm độc giả
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng độc giả</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">1,847</p>
              <p className="text-green-600 text-xs mt-1">↗ +23 tháng này</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">1,723</p>
              <p className="text-gray-500 text-xs mt-1">93% tổng số</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaUnlock className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Bị khóa</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">124</p>
              <p className="text-red-600 text-xs mt-1">7% tổng số</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FaLock className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Mới tháng này</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">23</p>
              <p className="text-blue-600 text-xs mt-1">↗ +15% so với T.trước</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaUserPlus className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Readers Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách độc giả</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Tất cả trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Bị khóa</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Tất cả loại</option>
                <option>Sinh viên</option>
                <option>Giảng viên</option>
                <option>Nhân viên</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin độc giả</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'DG001', name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0123456789', type: 'Sinh viên', status: 'active', borrowed: 3, joined: '12/01/2024' },
                { id: 'DG002', name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0987654321', type: 'Giảng viên', status: 'active', borrowed: 1, joined: '05/03/2024' },
                { id: 'DG003', name: 'Lê Văn C', email: 'levanc@email.com', phone: '0165432789', type: 'Sinh viên', status: 'locked', borrowed: 0, joined: '20/02/2024' },
                { id: 'DG004', name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0198765432', type: 'Nhân viên', status: 'active', borrowed: 2, joined: '08/04/2024' },
                { id: 'DG005', name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0147258369', type: 'Sinh viên', status: 'active', borrowed: 4, joined: '15/05/2024' },
              ].map((reader) => (
                <tr key={reader.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                        <FaUser className="text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reader.name}</div>
                        <div className="text-sm text-gray-500">ID: {reader.id}</div>
                        <div className="text-xs text-gray-400">Tham gia: {reader.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-xs" />
                        {reader.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-xs" />
                        {reader.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reader.type === 'Sinh viên' ? 'bg-blue-100 text-blue-800' :
                      reader.type === 'Giảng viên' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {reader.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reader.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reader.status === 'active' ? (
                        <>
                          <FaUnlock className="mr-1" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-1" />
                          Bị khóa
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaBook className="text-blue-500 text-sm" />
                      <span className="text-sm font-medium text-gray-900">{reader.borrowed}</span>
                      <span className="text-xs text-gray-500">sách</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Chi tiết</button>
                      <button className="text-green-600 hover:text-green-900 text-sm font-medium">Sửa</button>
                      {reader.status === 'active' ? (
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">Khóa</button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900 text-sm font-medium">Mở khóa</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">5</span> của{' '}
            <span className="font-medium">1,847</span> độc giả
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Trước
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderManager;