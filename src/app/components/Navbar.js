"use client";

import Link from "next/link";
import { FaChartLine, FaClipboardList, FaMoneyBillWave, FaUserAlt } from "react-icons/fa";

export default function NavBar({ activeTab, setActiveTab }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { key: "expenses", label: "Expenses", icon: <FaClipboardList /> },
    { key: "budgets", label: "Budgets", icon: <FaMoneyBillWave /> },
    { key: "reports", label: "Reports", icon: <FaChartLine /> },
    { key: "profile", label: "Profile", icon: <FaUserAlt /> },
  ];

  return (
    <nav className="flex flex-wrap justify-center items-center gap-6 bg-white shadow px-4 py-4 mb-8">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActiveTab(item.key)}
          className={`flex items-center gap-1 font-medium ${
            activeTab === item.key
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  );
}
