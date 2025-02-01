"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import Spinner from "./Spinner";

export default function ExpensesSection({
  expenses,
  isLoading,
  onDeleteExpense,
  onEditExpense,
  onViewReceipt,
  onOpenAddModal,
}) {
  if (isLoading) {
    return (
      <div className="py-6">
        <Spinner />
      </div>
    );
  }

  if (!isLoading && expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-gray-600">No expenses found.</p>
        <button
          onClick={onOpenAddModal}
          className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <FaTrash className="rotate-45" /> Add Expense
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <span className="font-bold">+</span> Add Expense
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Receipt</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">${expense.amount}</td>
                <td className="py-2 px-4">{expense.category}</td>
                <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{expense.description}</td>
                <td className="py-2 px-4">
                  {expense.receiptUrl ? (
                    // Display the image as a small circular avatar.
                    <img
                      src={expense.receiptUrl}
                      alt="Receipt"
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                      onClick={() => onViewReceipt(expense.receiptUrl)}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <button onClick={() => onEditExpense(expense)} className="text-yellow-600 hover:text-yellow-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDeleteExpense(expense._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
