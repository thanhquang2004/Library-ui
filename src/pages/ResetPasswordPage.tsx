import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [token, setOtp] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirm) {
      return setError("Mật khẩu xác nhận không khớp");
    }
    if (!validatePassword(newPassword)) {
      return setError("Mật khẩu phải >= 8 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt");
    }

    try {
      const res = await axios.post(`${API_BASE}/users/reset-password`, { token, newPassword });
      if (res.data.success) {
        setSuccess("Đổi mật khẩu thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res.data.error || "OTP không đúng hoặc đổi mật khẩu thất bại");
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
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h2>

        {/* fake input để chặn autofill */}
        <input type="text" name="fake-user" style={{ display: "none" }} autoComplete="username" />
        <input type="password" name="fake-pass" style={{ display: "none" }} autoComplete="new-password" />

        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Nhập mã OTP"
          value={token}
          onChange={(e) => setOtp(e.target.value)}
          required
          autoComplete="one-time-code"
        />

        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button type="submit" className="w-full bg-[#00ACE8] text-white py-2 rounded-lg hover:bg-blue-600">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
