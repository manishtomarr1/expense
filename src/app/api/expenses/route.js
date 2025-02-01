import clientPromise from "../../../libs/mongodb";

import * as yup from "yup";

// Expense validation schema
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const category = searchParams.get("category");
    const date = searchParams.get("date"); // Expecting ISO date or yyyy-mm-dd
    const search = searchParams.get("search");

    const query = {};
    if (category) query.category = category;
    if (date) {
      // Assume date filter means the expense date is equal to the given date.
      // Convert date string to a Date object and filter using a range.
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    if (search) {
      // Search in description (case-insensitive)
      query.description = { $regex: search, $options: "i" };
    }

    const client = await clientPromise;
    const db = client.db();
    const expensesCollection = db.collection("expenses");

    // Get total count for pagination
    const total = await expensesCollection.countDocuments(query);

    const expenses = await expensesCollection
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const pages = Math.ceil(total / limit);
    return new Response(
      JSON.stringify({ expenses, total, page, pages }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching expenses: " + error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await expenseSchema.validate(body);
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("expenses").insertOne(body);
    return new Response(
      JSON.stringify({ message: "Expense created", id: result.insertedId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 400 }
    );
  }
}
