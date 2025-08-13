import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";



const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (data: typeof formData) => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      // Axios sẽ tự parse JSON, không cần .json()
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Đăng nhập thất bại");
      }

      // Lưu token và user vào AuthProvider
      login(result.data.token, {
        id: result.data.userId,
        email: result.data.email,
        username: result.data.name,
      });

      // Chuyển hướng về trang Home
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Đăng nhập thất bại");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Lỗi không xác định");
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#00ACE8] to-[#B2EBF2] flex items-center justify-end px-4">
      <div className="w-3/5 flex flex-col items-center justify-center p-8">
        <img
          src="/src/img/logo-login.png"
          alt="Library"
          className="max-w-md w-full mb-6 rounded-lg"
        />
      </div>
      <div className="w-full md:w-2/5 max-w-lg bg-white rounded-xl shadow-lg p-8 max-h-[90vh] overflow-y-auto mr-36">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#00ACE8]">Login</h2>
        <LoginForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={error}
        />
      </div>
    </div>
  );
};

export default LoginPage;
