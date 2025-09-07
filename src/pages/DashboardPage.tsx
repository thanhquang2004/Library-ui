import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import BookManager from "../components/BookManager";
import BorrowReturn from "../components/BorrowReturn";
import ReaderManager from "../components/ReaderManager";
import FeeManager from "../components/FeeManager";
import Reports from "../components/Reports";

const DashboardPage: React.FC = () => {
  const [active, setActive] = useState("books");

  const renderContent = () => {
    switch (active) {
      case "books":
        return <BookManager />;
      case "borrow":
        return <BorrowReturn />;
      case "readers":
        return <ReaderManager />;
      case "fees":
        return <FeeManager />;
      case "reports":
        return <Reports />;
      default:
        return <BookManager />;
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar active={active} setActive={setActive} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default DashboardPage;
