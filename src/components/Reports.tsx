// import React from "react";
import { FaChartBar, FaDownload, FaFilter, FaBook, FaUsers, FaClock } from "react-icons/fa";

const Reports: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaChartBar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
            <p className="text-gray-600">Thống kê mượn/trả, sách quá hạn, danh mục phổ biến</p>
          </div>
        </div>
      </div>

      {/* Filter & Export Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Tháng này</option>
              <option>Tuần này</option>
              <option>Hôm nay</option>
              <option>Tùy chỉnh</option>
            </select>

            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Tất cả loại báo cáo</option>
              <option>Mượn/trả sách</option>
              <option>Độc giả</option>
              <option>Phí phạt</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
              <FaFilter className="text-sm" />
              Lọc nâng cao
            </button>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
            <FaDownload className="text-sm" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Lượt mượn tháng này</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">1,247</p>
              <div className="flex items-center gap-1 mt-1">

                <p className="text-green-600 text-xs">↗ +15% so với T.trước</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaBook className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Độc giả hoạt động</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">847</p>
              <div className="flex items-center gap-1 mt-1">

                <p className="text-green-600 text-xs">↗ +8% so với T.trước</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaUsers className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sách quá hạn</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">45</p>
              <div className="flex items-center gap-1 mt-1">

                <p className="text-red-600 text-xs">↗ +3 so với tuần trước</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FaClock className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tỷ lệ trả đúng hạn</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">92%</p>
              <div className="flex items-center gap-1 mt-1">

                <p className="text-green-600 text-xs">↗ +2% so với T.trước</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaChartBar className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Books Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Sách được mượn nhiều nhất</h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {[
                { title: 'Lập trình JavaScript', author: 'Nguyễn Văn A', borrows: 47, trend: '+12%' },
                { title: 'Cơ sở dữ liệu MySQL', author: 'Trần Thị B', borrows: 42, trend: '+8%' },
                { title: 'Python cho người mới', author: 'Lê Văn C', borrows: 38, trend: '+15%' },
                { title: 'React Handbook', author: 'Phạm Thị D', borrows: 35, trend: '+22%' },
                { title: 'Machine Learning', author: 'Hoàng Văn E', borrows: 31, trend: '+5%' },
              ].map((book, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-400' :
                            'bg-blue-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{book.borrows} lượt</p>
                    <p className="text-xs text-green-600">{book.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borrowing Trends */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Xu hướng mượn sách</h3>
          </div>

          <div className="p-6">
            {/* Simulated Chart Area */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-end justify-between h-32">
                {[25, 45, 35, 55, 40, 60, 50].map((height, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600">T{index + 2}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">1,847</p>
                <p className="text-sm text-gray-600">Tổng lượt mượn</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Thống kê theo danh mục</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: 'Công nghệ thông tin', books: 847, borrows: 1235, color: 'blue' },
              { category: 'Kinh tế', books: 423, borrows: 672, color: 'green' },
              { category: 'Văn học', books: 356, borrows: 489, color: 'purple' },
              { category: 'Khoa học', books: 278, borrows: 341, color: 'orange' },
            ].map((cat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow duration-200">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${cat.color === 'blue' ? 'bg-blue-100' :
                    cat.color === 'green' ? 'bg-green-100' :
                      cat.color === 'purple' ? 'bg-purple-100' :
                        'bg-orange-100'
                  }`}>
                  <FaBook className={`text-2xl ${cat.color === 'blue' ? 'text-blue-600' :
                      cat.color === 'green' ? 'text-green-600' :
                        cat.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                    }`} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{cat.category}</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{cat.books} cuốn sách</p>
                  <p className="text-sm text-gray-600">{cat.borrows} lượt mượn</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Reports;