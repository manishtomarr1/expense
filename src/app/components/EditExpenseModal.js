"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReceiptUpload from "./ReceiptUpload";

// Expense validation schema
const expenseSchema = Yup.object().shape({
  amount: Yup.number().required("Amount is required"),
  category: Yup.string()
    .oneOf(["Food", "Transport", "Entertainment", "Rent"], "Invalid category")
    .required("Category is required"),
  date: Yup.date().required("Date is required"),
  description: Yup.string().optional(),
  receiptUrl: Yup.string().url("Invalid URL").nullable(),
});

export default function EditExpenseModal({ onClose, onSubmit, expense }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
        <Formik
          initialValues={{
            amount: expense.amount,
            category: expense.category,
            date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
            description: expense.description || "",
            receiptUrl: expense.receiptUrl || "",
          }}
          validationSchema={expenseSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4" noValidate>
              <div>
                <label htmlFor="amount" className="block text-gray-700 font-medium">Amount (₹)</label>
                <Field id="amount" name="amount" type="number" placeholder="e.g., 500" className="w-full border p-2 rounded" />
                <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium">Category</label>
                <Field as="select" id="category" name="category" className="w-full border p-2 rounded">
                  <option value="">Select category</option>
                  {["Food", "Transport", "Entertainment", "Rent"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium">Date</label>
                <Field id="date" name="date" type="date" className="w-full border p-2 rounded" />
                <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium">Description</label>
                <Field as="textarea" id="description" name="description" placeholder="Optional description" className="w-full border p-2 rounded" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Receipt</label>
                <ReceiptUpload setFieldValue={setFieldValue} currentUrl={values.receiptUrl} />
                {values.receiptUrl && (
                  <p className="mt-1 text-sm text-green-600">
                    Uploaded: <a href={values.receiptUrl} target="_blank" rel="noopener noreferrer" className="underline">View Receipt</a>
                  </p>
                )}
                <ErrorMessage name="receiptUrl" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {isSubmitting ? "Updating..." : "Update Expense"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
