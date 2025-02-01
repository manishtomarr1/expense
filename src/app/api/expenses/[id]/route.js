import clientPromise from "../../../../libs/mongodb";
import { ObjectId } from "mongodb";
import * as yup from "yup";

const expenseSchema = yup.object().shape({
  amount: yup.number().required("Amount is required"),
  category: yup
    .string()
    .oneOf(["Food", "Transport", "Entertainment", "Rent"], "Invalid category")
    .required("Category is required"),
  date: yup.date().required("Date is required"),
  description: yup.string().optional(),
  receiptUrl: yup.string().url("Invalid URL").nullable(),
});

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const expense = await db.collection("expenses").findOne({ _id: new ObjectId(id) });
    if (!expense) return new Response(JSON.stringify({ message: "Expense not found" }), { status: 404 });
    return new Response(JSON.stringify(expense), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching expense" }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await expenseSchema.validate(body);
    const client = await clientPromise;
    const db = client.db();
    await db.collection("expenses").updateOne({ _id: new ObjectId(id) }, { $set: body });
    return new Response(JSON.stringify({ message: "Expense updated" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    await db.collection("expenses").deleteOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify({ message: "Expense deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error deleting expense" }), { status: 500 });
  }
}
