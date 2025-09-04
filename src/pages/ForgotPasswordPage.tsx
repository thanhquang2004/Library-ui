import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${API_BASE}/users/forgot-password`, { email });
      if (res.data.success) {
        setSuccess("Mã OTP đã được gửi đến email của bạn");
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 1000);
      } else {
        setError(res.data.error || "Không thể gửi OTP");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Có lỗi xảy ra từ server");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Nhập email đã đăng ký"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button type="submit" className="w-full bg-[#00ACE8] text-white py-2 rounded-lg hover:bg-blue-600">
          Gửi OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
