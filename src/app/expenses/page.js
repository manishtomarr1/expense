"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Validation schema for expense form
const expenseSchema = Yup.object().shape({
  amount: Yup.number().required("Amount is required"),
  category: Yup.string()
    .oneOf(["Food", "Transport", "Entertainment", "Rent"], "Invalid category")
    .required("Category is required"),
  date: Yup.date().required("Date is required"),
  description: Yup.string().optional(),
  receiptUrl: Yup.string().url("Invalid URL").nullable(),
});

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Expense added successfully");
      resetForm();
      setShowAddModal(false);
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Failed to add expense");
    }
    setSubmitting(false);
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Failed to delete expense");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">My Expenses</h1>
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 transition"
      >
        <FaPlus /> Add Expense
      </button>

      {isLoading ? (
        <div>Loading expenses...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Receipt</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="py-2 px-4 border">${expense.amount}</td>
                <td className="py-2 px-4 border">{expense.category}</td>
                <td className="py-2 px-4 border">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">{expense.description}</td>
                <td className="py-2 px-4 border">
                  {expense.receiptUrl ? (
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-2 px-4 border flex items-center gap-2">
                  {/* Edit functionality can be added later */}
                  <button className="text-yellow-600 hover:text-yellow-800">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <Formik
              initialValues={{
                amount: "",
                category: "",
                date: "",
                description: "",
                receiptUrl: "",
              }}
              validationSchema={expenseSchema}
              onSubmit={handleAddExpense}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="amount" className="block text-gray-700 font-medium">
                      Amount
                    </label>
                    <Field
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="e.g., 50"
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-gray-700 font-medium">
                      Category
                    </label>
                    <Field as="select" id="category" name="category" className="w-full border p-2 rounded">
                      <option value="">Select category</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Rent">Rent</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-gray-700 font-medium">
                      Date
                    </label>
                    <Field id="date" name="date" type="date" className="w-full border p-2 rounded" />
                    <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-gray-700 font-medium">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      placeholder="Optional description"
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="receiptUrl" className="block text-gray-700 font-medium">
                      Receipt URL
                    </label>
                    <Field
                      id="receiptUrl"
                      name="receiptUrl"
                      type="url"
                      placeholder="https://..."
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage name="receiptUrl" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                      {isSubmitting ? "Adding..." : "Add Expense"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
