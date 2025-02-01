"use client";

export default function DashboardHome({ totalExpenses, totalIncome, netBalance, budgetRemaining }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
        <p className="text-2xl font-bold text-red-500 mt-2">${totalExpenses}</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-700">Total Income</h2>
        <p className="text-2xl font-bold text-green-500 mt-2">${totalIncome}</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-700">Net Balance</h2>
        <p className="text-2xl font-bold text-blue-500 mt-2">${netBalance}</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-700">Budget Remaining</h2>
        <p className="text-2xl font-bold text-yellow-500 mt-2">${budgetRemaining}</p>
      </div>
    </div>
  );
}
