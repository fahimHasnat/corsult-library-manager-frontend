"use client";

import React from "react";

interface SidebarProps {
  activeTab: "books" | "users" | "reports";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"books" | "users" | "reports">
  >;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-6">
      <ul>
        <li
          className={`cursor-pointer mb-4 p-2 rounded ${
            activeTab === "books" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("books")}
        >
          Books
        </li>
        <li
          className={`cursor-pointer mb-4 p-2 rounded ${
            activeTab === "users" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </li>
        <li
          className={`cursor-pointer mb-4 p-2 rounded ${
            activeTab === "reports" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
