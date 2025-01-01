"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import BooksSection from "./components/BooksSection";
import UsersSection from "./components/UsersSection";
import ReportsSection from "./components/ReportsSection";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"books" | "users" | "reports">(
    "books"
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="w-3/4 bg-gray-100 p-8">
        {activeTab === "books" && <BooksSection />}
        {activeTab === "users" && <UsersSection />}
        {activeTab === "reports" && <ReportsSection />}
      </div>
    </div>
  );
};

export default AdminDashboard;
