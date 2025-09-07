import React, { createContext, useState, useEffect, useContext } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "librarian" | "member" | string; // để runtime không crash nếu backend trả khác
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expireTime, setExpireTime] = useState<number | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedExpire = localStorage.getItem("expireTime");

    if (savedToken && savedUser && savedExpire) {
      if (Date.now() > parseInt(savedExpire, 10)) {
        logout(); // hết hạn
      } else {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setExpireTime(parseInt(savedExpire, 10));
      }
    }

    setLoading(false);
  }, []);

  // 🕒 Cảnh báo gia hạn trước khi hết hạn 5 phút
  useEffect(() => {
    if (!expireTime || !user) return;

    const timeout = expireTime - Date.now() - 5 * 60 * 1000; // trừ 5 phút
    if (timeout <= 0) return;

    const timer = setTimeout(() => {
      if (window.confirm("Phiên đăng nhập sắp hết hạn, bạn có muốn gia hạn không?")) {
        extendSession(user); // gia hạn nếu user đồng ý
      } else {
        logout();
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [expireTime, user]);

  const login = (token: string, user: User, rememberMe: boolean = false) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    const now = Date.now();
    let newExpire: number;

    // 🔑 Chuẩn hoá role để tránh sai khác chữ hoa/thường
    const role = user.role.toLowerCase() as "admin" | "librarian" | "member";

    

    if (rememberMe) {
      if (role === "member") {
        newExpire = now + 3 * 24 * 60 * 60 * 1000; // 3 ngày
      } else {
        newExpire = now + 3 * 60 * 60 * 1000; // 3 giờ
      }
    } else {
      if (role === "member") {
        newExpire = now + 30 * 60 * 1000; // 30 phút
      } else {
        newExpire = now + 15 * 60 * 1000; // 15 phút
      }
    }

     console.log(
    "ROLE:",
    role,
    "expire in min:",
    ((newExpire - now) / 60000).toFixed(2)
  );

    localStorage.setItem("expireTime", newExpire.toString());
    setExpireTime(newExpire);
    setToken(token);
    setUser({ ...user, role }); // lưu lại role đã normalize
  };

  const extendSession = (user: User) => {
    const now = Date.now();
    let newExpire: number;

    const role = user.role.toLowerCase() as "admin" | "librarian" | "member";

    if (role === "member") {
      newExpire = now + 30 * 60 * 1000; // gia hạn thêm 30 phút
    } else {
      newExpire = now + 15 * 60 * 1000; // gia hạn thêm 15 phút
    }

    localStorage.setItem("expireTime", newExpire.toString());
    setExpireTime(newExpire);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expireTime");
    setToken(null);
    setUser(null);
    setExpireTime(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
