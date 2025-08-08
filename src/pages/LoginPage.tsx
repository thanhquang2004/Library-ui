import React, { useState } from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (data: typeof formData) => {
    setError(null); // Reset error
    console.log("Dữ liệu đăng nhập gửi lên:", data);

    // Demo xử lý đăng nhập
    // try {
    //   const response = await fetch("/api/users/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });
    //   const result = await response.json();
    //   if (!response.ok) throw new Error(result.error || "Login failed");
    //   alert("Login successful!");
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "An error occurred");
    // }
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

