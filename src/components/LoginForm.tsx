import React, { useState } from "react";

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: LoginFormProps["formData"]) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, onChange, onSubmit, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Gọi hàm submit từ LoginPage
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
        />
      </div>

      <div className="relative">
        <input
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-sm text-blue-500 focus:outline-none"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={onChange}
            className="mr-2"
          />
          Remember me
        </label>
        <a href="/forgot-password" className="text-blue-500 hover:underline">
          Forgot password?
        </a>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <button
          type="submit"
          className="w-full bg-[#00ACE8] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
