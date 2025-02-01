// src/app/api/auth/profile/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const { name, email } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { name, email, updatedAt: new Date() } }
    );

    return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
