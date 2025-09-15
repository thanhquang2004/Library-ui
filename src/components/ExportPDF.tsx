// components/ExportPDFButton.tsx
import { FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import React, { useState } from "react";

interface ExportPDFButtonProps {
    monthlyLendings: number;
    activeReaders: number;
    overdueBooks: number;
    onTimeRate: number;
    popularBooks: { bookId: string; title: string; author: string; borrows: number }[];
    borrowingTrends: { month: number; count: number }[];
    totalBorrows: number;
    completionRate: number;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
    monthlyLendings,
    activeReaders,
    overdueBooks,
    onTimeRate,
    popularBooks,
    borrowingTrends,
    totalBorrows,
    completionRate,
}) => {
    const [showModal, setShowModal] = useState(false);

    const handleConfirmExport = () => {
        const element = document.getElementById("report-content");
        if (!element) return;

        const opt = {
            margin: 10,
            filename: "bao-cao-thu-vien.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save();
        setShowModal(false); // đóng modal sau khi in
    };

    return (
        <>
            {/* Nút mở modal */}
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
                <FaDownload className="text-sm" />
                Xuất báo cáo
            </button>

            {/* Modal preview */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Xem trước báo cáo
                        </h2>

                        {/* Nội dung báo cáo */}
                        <div id="report-content" className="text-sm">
                            <h2 className="text-lg font-bold mb-2">
                                BÁO CÁO THỐNG KÊ THƯ VIỆN
                            </h2>

                            <h3 className="font-semibold mt-4 mb-2">Chỉ số chính</h3>
                            <table className="w-full border border-gray-300 text-center text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">Lượt mượn tháng này</th>
                                        <th className="border p-2">Độc giả hoạt động</th>
                                        <th className="border p-2">Sách quá hạn</th>
                                        <th className="border p-2">Tỷ lệ trả đúng hạn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">{monthlyLendings}</td>
                                        <td className="border p-2">{activeReaders}</td>
                                        <td className="border p-2">{overdueBooks}</td>
                                        <td className="border p-2">{onTimeRate}%</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3 className="font-semibold mt-4 mb-2">
                                Top sách được mượn nhiều nhất
                            </h3>
                            <table className="w-full border border-gray-300 text-center text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">#</th>
                                        <th className="border p-2">Tên sách</th>
                                        <th className="border p-2">Tác giả</th>
                                        <th className="border p-2">Lượt mượn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {popularBooks.slice(0, 5).map((b, i) => (
                                        <tr key={b.bookId}>
                                            <td className="border p-2">{i + 1}</td>
                                            <td className="border p-2">{b.title}</td>
                                            <td className="border p-2">{b.author}</td>
                                            <td className="border p-2">{b.borrows}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h3 className="font-semibold mt-4 mb-2">
                                Xu hướng mượn sách (6 tháng gần nhất)
                            </h3>
                            <table className="w-full border border-gray-300 text-center text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">Tháng</th>
                                        <th className="border p-2">Số lượt mượn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {borrowingTrends.map((b, i) => (
                                        <tr key={i}>
                                            <td className="border p-2">T{b.month}</td>
                                            <td className="border p-2">{b.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p className="mt-4 mb-10 font-medium">
                                Tổng lượt mượn: {totalBorrows} | Tỷ lệ hoàn thành:{" "}
                                {completionRate}%
                            </p>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmExport}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Xác nhận in
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExportPDFButton;
