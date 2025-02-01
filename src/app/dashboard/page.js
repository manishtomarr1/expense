"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Import modular components
import NavBar from "../components/Navbar";
import DashboardHome from "../components/DashboardHome";
import ExpensesSection from "../components/ExpensesSection";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";
import ImageModal from "../components/ImageModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Spinner from "../components/Spinner";
import ExpensesFilters from "../components/ExpensesFilters";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "expenses", "budgets", "reports", "profile"
  const [expensesData, setExpensesData] = useState({ expenses: [], total: 0, page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [filters, setFilters] = useState({ category: "", date: "", search: "" });
  const [currentPage, setCurrentPage] = useState(1);

  // Replace dummy summary metrics with computed values from expensesData.expenses if needed
  const totalExpenses = expensesData.expenses.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalIncome = 3000; // For demonstration – ideally, fetch or compute this from your data
  const netBalance = totalIncome - totalExpenses;
  const budgetRemaining = 500; // For demonstration

  // Redirect if no session
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/login");
  }, [session, status, router]);

  const fetchExpenses = async (page = 1, filters = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", "5");
      if (filters.category) params.append("category", filters.category);
      if (filters.date) params.append("date", filters.date);
      if (filters.search) params.append("search", filters.search);
      const res = await fetch(`/api/expenses?${params.toString()}`);
      const data = await res.json();
      setExpensesData(data);
      setCurrentPage(data.page);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeTab === "expenses") fetchExpenses(currentPage, filters);
  }, [activeTab, currentPage, filters]);

  const handleDeleteExpense = (id) => {
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteExpense = async () => {
    try {
      const res = await fetch(`/api/expenses/${expenseToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Expense deleted successfully");
      fetchExpenses(currentPage, filters);
    } catch (error) {
      toast.error(error.message || "Failed to delete expense");
    }
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  const handleAddExpense = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Expense added successfully");
      resetForm();
      setShowAddModal(false);
      fetchExpenses(currentPage, filters);
    } catch (error) {
      toast.error(error.message || "Failed to add expense");
    }
    setSubmitting(false);
  };

  const handleEditExpense = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch(`/api/expenses/${editingExpense._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Expense updated successfully");
      resetForm();
      setShowEditModal(false);
      setEditingExpense(null);
      fetchExpenses(currentPage, filters);
    } catch (error) {
      toast.error(error.message || "Failed to update expense");
    }
    setSubmitting(false);
  };

  // Handlers for editing and viewing receipt
  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const openImageModal = (url) => {
    setModalImageUrl(url);
    setShowImageModal(true);
  };

  // Content switcher based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <DashboardHome
              totalExpenses={totalExpenses}
              totalIncome={totalIncome}
              netBalance={netBalance}
              budgetRemaining={budgetRemaining}
            />
            <section className="bg-white p-6 rounded shadow mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Trends</h2>
              <div className="h-64 flex items-center justify-center text-gray-400">
                {/* Replace with your chart component */}
                Chart Placeholder
              </div>
            </section>
          </>
        );
      case "expenses":
        return (
          <>
            <ExpensesFilters
              filters={filters}
              setFilters={setFilters}
              onSearch={() => fetchExpenses(1, filters)}
            />
            <ExpensesSection
              expenses={expensesData.expenses}
              isLoading={isLoading}
              onDeleteExpense={handleDeleteExpense}
              onOpenAddModal={() => setShowAddModal(true)}
              onEditExpense={openEditModal}
              onViewReceipt={openImageModal}
            />
            {/* Pagination Controls */}
            <div className="flex justify-end items-center mt-4 gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => fetchExpenses(currentPage - 1, filters)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {expensesData.page} of {expensesData.pages}
              </span>
              <button
                disabled={currentPage >= expensesData.pages}
                onClick={() => fetchExpenses(currentPage + 1, filters)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        );
      case "budgets":
        return (
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">Budgets</h2>
            <p>Budgets functionality coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
            <p>Reports functionality coming soon...</p>
          </div>
        );
      case "profile":
        return (
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            <p>Profile management coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="px-6">{renderContent()}</div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <AddExpenseModal onClose={() => setShowAddModal(false)} onSubmit={handleAddExpense} />
      )}

      {/* Edit Expense Modal */}
      {showEditModal && editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => {
            setShowEditModal(false);
            setEditingExpense(null);
          }}
          onSubmit={handleEditExpense}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          message="Are you sure you want to delete this expense?"
          onConfirm={() => confirmDeleteExpense()}
          onCancel={() => {
            setShowDeleteModal(false);
            setExpenseToDelete(null);
          }}
        />
      )}

      {/* Image Modal for Receipt Preview */}
      {showImageModal && modalImageUrl && (
        <ImageModal
          imageUrl={modalImageUrl}
          onClose={() => {
            setShowImageModal(false);
            setModalImageUrl("");
          }}
        />
      )}
    </div>
  );
}
