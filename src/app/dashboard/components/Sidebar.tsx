"use client";

import React, { useState } from "react";
import { FiBook, FiRefreshCcw, FiBarChart2 } from "react-icons/fi";

interface SidebarProps {
  activeTab: "books" | "returns" | "account";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"books" | "returns" | "account">
  >;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-gradient-to-b from-blue-800 via-blue-700 to-blue-900 text-white h-screen p-4 flex flex-col transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div
        className="flex justify-end mb-6 cursor-pointer text-gray-300 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-lg">{isOpen ? "⟨" : "⟩"}</div>
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-4">
        <li
          className={`flex items-center cursor-pointer p-2 rounded-lg ${
            activeTab === "books"
              ? "bg-blue-500 text-white shadow-lg"
              : "hover:bg-blue-700"
          }`}
          onClick={() => setActiveTab("books")}
        >
          <FiBook className="text-xl mr-3" />
          {isOpen && <span className="text-sm">Books</span>}
        </li>
        <li
          className={`flex items-center cursor-pointer p-2 rounded-lg ${
            activeTab === "returns"
              ? "bg-blue-500 text-white shadow-lg"
              : "hover:bg-blue-700"
          }`}
          onClick={() => setActiveTab("returns")}
        >
          <FiRefreshCcw className="text-xl mr-3" />
          {isOpen && <span className="text-sm">Returns</span>}
        </li>
        <li
          className={`flex items-center cursor-pointer p-2 rounded-lg ${
            activeTab === "account"
              ? "bg-blue-500 text-white shadow-lg"
              : "hover:bg-blue-700"
          }`}
          onClick={() => setActiveTab("account")}
        >
          <FiBarChart2 className="text-xl mr-3" />
          {isOpen && <span className="text-sm">My Account</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
