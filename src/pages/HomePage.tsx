// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import SidebarLayout from "../components/Sidebar"; // lưu ý đổi tên nếu cần


// const HomePage: React.FC = () => {
//   const { user } = useAuth();

//   return (
//     <SidebarLayout
//       user={user ? { name: user.username, role: user.role || "unknown" } : null}
//       isLoading={false}
//     >
//       {/* Nội dung chính */}
//       <div className="p-6 flex-1 overflow-y-auto">
//         <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
//           <h1 className="text-3xl font-bold text-blue-600">
//             Hello, {user?.username}!
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Chào mừng bạn quay trở lại hệ thống.
//           </p>
//         </div>
//       </div>
//     </SidebarLayout>
//   );
// };

// export default HomePage;
import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";
import DashboardPage from "./DashboardPage"; // import thêm

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      {/* Nội dung chính */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Hello, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Chào mừng bạn quay trở lại hệ thống.
          </p>
        </div>

        {/* Nếu role = librarian thì hiển thị Dashboard */}
        {user?.role === "librarian" && (
          <div className="mt-6">
            <DashboardPage />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default HomePage;
