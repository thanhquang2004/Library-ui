import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiNoAuth } from "../api"; // Import named export từ file api.ts
import { AxiosError } from "axios";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho trạng thái loading
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true); // Bắt đầu loading

    try {
      // Sử dụng instance apiNoAuth đã được cấu hình sẵn
      const res = await apiNoAuth.post("/users/forgot-password", { email });
      
      // Chú ý: apiNoAuth đã có sẵn baseURL, nên không cần API_BASE nữa
      if (res.data.success) {
        setSuccess("Mã OTP đã được gửi đến email của bạn. Đang chuyển hướng...");
        // Không cần setTimeout, chuyển hướng ngay khi nhận được phản hồi thành công
        navigate("/reset-password", { state: { email } });
      } else {
        setError(res.data.error || "Không thể gửi OTP.");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Xử lý lỗi từ server, lấy thông điệp cụ thể nếu có
        const serverError = err.response?.data?.error;
        setError(serverError || "Có lỗi xảy ra từ server.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
        <div className="mb-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACE8]"
            placeholder="Nhập email đã đăng ký"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-[#00ACE8] text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading} // Vô hiệu hóa nút khi đang loading
        >
          {isLoading ? "Đang xử lý..." : "Gửi OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;