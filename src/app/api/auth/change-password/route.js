// src/app/api/auth/change-password/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const { currentPassword, newPassword } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Validate current password
    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { hashedPassword: newHashedPassword, updatedAt: new Date() } }
    );

    return new Response(JSON.stringify({ message: "Password updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Change password error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
