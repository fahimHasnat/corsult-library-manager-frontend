"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import BooksSection from "./components/BooksSection";
import ReturnSection from "./components/ReturnSection";
import AccountSection from "./components/AccountSection";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"books" | "returns" | "account">(
    "books"
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="w-3/4 bg-gray-100 p-8">
        {activeTab === "books" && <BooksSection />}
        {activeTab === "returns" && <ReturnSection />}
        {activeTab === "account" && <AccountSection />}
      </div>
    </div>
  );
};

export default Dashboard;
